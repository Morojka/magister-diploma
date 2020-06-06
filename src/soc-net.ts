const VkBot = require('node-vk-bot-api')
import {createConnection} from "typeorm";
import {User} from "./entity/User";

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
    console.log('vk db connected');

    const scene = new Scene('start',
        async (ctx) => {
            const user = await connection.manager.findOne(User, {
                where: {
                    vk_id: ctx.message.user_id,
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
            console.log(ctx.message);
            if(/([0-9])\d{5}/.test(ctx.message.body)) {
                let user = new User();
                user.record_number = ctx.message.body;
                user.vk_id = ctx.message.user_id;
                user.save();

                ctx.reply('Вы успешно зарегистрированы! Кабинет тут: https://volsu-helper.herokuapp.com/');
                ctx.scene.leave()
            } else {
                ctx.reply('Не нахожу такой зачетки, попробуйте еще.');
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
            // AI
        } else {
            ctx.reply('Здравствуйте! Введите /start для начала работы');
        }
        console.log(ctx.message.body);
    });
});

export default bot;