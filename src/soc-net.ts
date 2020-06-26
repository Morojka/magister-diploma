import net from "./ai";

const VkBot = require('node-vk-bot-api')
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Record} from "./entity/Record";

const axios = require('axios').default;
const cheerio = require('cheerio')

var mimir = require('./bow'),
    bow = mimir.bow,
    dict = mimir.dict;
const texts = [
        'Дай мне на расписание расписания выдай распис расп р покажи распорядок моё мое сегодня пара пару пары',
        'баллы баллов балл б оценку оценки оценок рейтинг',
    ],
    voc = dict(texts);

const MARKS_COMMAND = 0;
const SCHEDULE_COMMAND = 1;

let dictionary = {
    0: MARKS_COMMAND,
    1: SCHEDULE_COMMAND,
}

const bot = new VkBot({
    token: process.env.VK_COMM_TOKEN,
    confirmation: process.env.VK_COMM_CONFIRMATION,
})

const Session = require('node-vk-bot-api/lib/session')
const Stage = require('node-vk-bot-api/lib/stage')
const Scene = require('node-vk-bot-api/lib/scene')

const session = new Session()

bot.use(session.middleware())

createConnection().then(async connection => {
    const scene = new Scene('start',
        async (ctx) => {
            const user = await connection.manager.findOne(User, {
                where: {
                    vk_id: ctx.message.user_id,
                },
                relations: ['record']
            });

            ctx.session.registered = !!user;

            if (user && user.record && ctx.session.registered) {
                ctx.reply('Здравствуйте! Ваша учетная запись уже привязана к зачетке:' + user.record.value)
                ctx.scene.leave();
            } else {
                ctx.reply('Здравствуйте! Введите номер зачетки')
                ctx.scene.next();
            }
        },
        async (ctx) => {
            if (/([0-9])\d{5}/.test(ctx.message.body)) {
                const record = await connection.manager.findOne(Record, {where: {value: ctx.message.body}})
                if (record) {
                    console.log(record);
                    let user = new User();
                    user.record = record;
                    user.vk_id = ctx.message.user_id;

                    await connection.manager.save(user).then(() => {
                        ctx.reply('Вы успешно зарегистрированы! Кабинет тут: https://volsu-helper.herokuapp.com/');
                        ctx.scene.leave()
                    });
                } else {
                    ctx.reply('Не нахожу такой зачетки, попробуйте еще.');
                }
            } else {
                ctx.reply('Номер зачетки состоит из шести цифр. Пример: 123456. Попробуйте еще!');
            }
        }
    );

    const stage = new Stage(scene);
    bot.use(stage.middleware());

    bot.command('/start', (ctx) => {
        ctx.scene.enter('start');
        console.log('start');
    })

    bot.on(async (ctx) => {
        const user = await connection.manager.findOne(User, {
            where: {
                vk_id: ctx.message.user_id,
            },
            relations: ["scheduleDays", "record", "scheduleDays.lessons", "record.group"]
        });

        if (user) {
            const output = net.run(bow(ctx.message.body, voc));
            const answer = output.indexOf(Math.max(...output));
            let replyMessage = 'Произошло что-то непридвиденное, повторите попытку позднее';

            if (dictionary[answer] === SCHEDULE_COMMAND) {
                replyMessage = '';
                const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
                const now = days[new Date().getDay()];

                if(user.scheduleDays && user.scheduleDays.length > 0) {
                    let scheduleDayNumerator = user.scheduleDays.find(scheduleDay => scheduleDay.day === now && scheduleDay.numerator)
                    let scheduleDayDenumerator = user.scheduleDays.find(scheduleDay => scheduleDay.day === now && !scheduleDay.numerator)

                    let numeratorLessons = scheduleDayNumerator.lessons.sort((a, b) => (a.number > b.number) ? 1 : -1)
                    let denumeratorLessons = scheduleDayDenumerator.lessons.sort((a, b) => (a.number > b.number) ? 1 : -1)

                    replyMessage += 'Числитель:\n'

                    numeratorLessons.map((lesson) => {
                        if (lesson.name && lesson.place) {
                            replyMessage += `${lesson.number}\t|\t${lesson.time}\t|\t${lesson.name}\t|\t${lesson.place}\n`
                        } else {
                            replyMessage += `${lesson.number}\t|\t${lesson.time}\t|\tокно\n`
                        }
                    })

                    replyMessage += '\nЗнаменатель:\n'

                    denumeratorLessons.map((lesson) => {
                        if (lesson.name && lesson.place) {
                            replyMessage += `${lesson.number}\t|\t${lesson.time}\t|\t${lesson.name}\t|\t${lesson.place}\n`
                        } else {
                            replyMessage += `${lesson.number}\t|\t${lesson.time}\t|\tокно\n`
                        }
                    })

                    ctx.reply(replyMessage).catch((err) => {
                        console.log('err');
                        console.log(err);
                        ctx.reply('Ошибка');
                    });
                } else {
                    ctx.reply('Расписание для Вас отсутствует. Посетите сайт https://volsu-helper.herokuapp.com для его составления').catch((err) => {
                        console.log('err');
                        console.log(err);
                        ctx.reply('Ошибка');
                    });
                }


            } else if (dictionary[answer] === MARKS_COMMAND) {
                axios.get(`https://volsu.ru/rating/test.php`, {
                    params: {
                        l: 'tab',
                        id: [user.record.group.code, user.record.value, user.record.group.semester, user.record.group.name].join('volsu'),
                    }
                }).then((response) => {
                    const $ = cheerio.load(response.data)
                    let lessonNames = [];
                    let lessonVals = [];

                    $('table tr.cap td').each((index, row) => {
                        let str = $($(row).children('div')[0]).text() + ($($(row).children('div')[1]).text() !== '' ? ` (${$($(row).children('div')[1]).text()})` : ``)
                        lessonNames.push(str)
                    })

                    $('table tr:not(.cap) td').each((index, row) => {
                        lessonVals.push($(row).text())
                    })

                    let buff = lessonNames.map((name, index) => {
                        return `${name}: ${lessonVals[index]}`
                    })
                    replyMessage = buff.join('\n')

                    ctx.reply(replyMessage).catch((err) => {
                        console.log('err');
                        console.log(err);
                        ctx.reply('Ошибка');
                    });
                })
            }
        } else {
            ctx.reply('Здравствуйте! Введите /start для начала работы');
        }
    });
});

export default bot;