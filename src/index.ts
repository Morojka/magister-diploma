import "reflect-metadata";
var app = require('./app');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

import {createConnection} from "typeorm";
import {User} from "./entity/User";

createConnection().then(async connection => {
    console.log('DB Started');

    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    const VkBot = require('node-vk-bot-api')
    const bot = new VkBot(process.env.VK_TOKEN)

    bot.command('/start', (ctx) => {
        ctx.reply('Hello!')
    })

}).catch(error => console.log(error));
