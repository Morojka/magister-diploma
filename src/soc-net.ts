import net from "./ai";

const VkBot = require('node-vk-bot-api')
import {createConnection} from "typeorm";
import {User} from "./entity/User";
import {Record} from "./entity/Record";

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
            });

            ctx.session.registered = !!user;

            if (ctx.session.registered) {
                ctx.reply('Здравствуйте! Ваша учетная запись уже привязана к зачетке:' + user.record.value)
                ctx.scene.leave();
            } else {
                ctx.reply('Здравствуйте! Введите номер зачетки')
                ctx.scene.next();
            }
        },
        async (ctx) => {
            if(/([0-9])\d{5}/.test(ctx.message.body)) {
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

    bot.on((ctx) => {
        if(ctx.session.registered) {
            var output = net.run(ctx.message.body);
            console.log('output');
            console.log(output);
            ctx.reply(output).catch((err) => {
                console.log('err');
                console.log(err);
                ctx.reply('Ошибка');
            });
        } else {
            ctx.reply('Здравствуйте! Введите /start для начала работы');
        }
        console.log(ctx.message.body);
    });
});

export default bot;