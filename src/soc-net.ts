const VkBot = require('node-vk-bot-api')
import {createConnection} from "typeorm";
import {User} from "./entity/User";

const bot = new VkBot(process.env.VK_COMM_TOKEN)

const Session = require('node-vk-bot-api/lib/session')
const Stage = require('node-vk-bot-api/lib/stage')
const Scene = require('node-vk-bot-api/lib/scene')

const session = new Session()

bot.use(session.middleware())

createConnection().then(async connection => {
    console.log('vk db connected');

    const scene = new Scene('start',
        async (ctx) => {
            const user = await connection.manager.findOne(User, {
                where: {
                    vk_id: ctx.message.from_id,
                },
            });

            ctx.session.registered = !!user;

            if (ctx.session.registered) {
                ctx.reply('Здравствуйте! Ваша учетная запись уже привязана к зачетке:' + user.record_number)
                ctx.scene.leave();
            } else {
                ctx.reply('Здравствуйте! Введите номер зачетки')
                ctx.scene.next();
            }
        },
        (ctx) => {
            if(/([0-9])\d{5}/.test(ctx.message.text)) {
                let user = new User();
                user.record_number = ctx.message.text;
                user.vk_id = ctx.message.from_id;
                user.save();

                ctx.reply('Вы успешно зарегистрированы! Кабинет тут: https://volsu-helper.herokuapp.com/');
                ctx.scene.leave()
            }
            ctx.reply('Не нахожу такой зачетки, попробуйте еще.');
        }
    );

    const stage = new Stage(scene);
    bot.use(stage.middleware());

    bot.command('/start', (ctx) => {
        ctx.scene.enter('start');
        console.log('start');
    })

    bot.on((ctx) => {
        ctx.reply('Hello!');
        console.log(ctx.message.text);
    });
});

export default bot;