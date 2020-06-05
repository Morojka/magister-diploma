import "reflect-metadata";
import VkBot from 'node-vk-bot-api'
import {createConnection} from "typeorm"
import {User} from "./entity/User"

var app = require('./app')

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

createConnection().then(async connection => {
    console.log('DB Started');

    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    // const bot = new VkBot(process.env.VK_TOKEN)

    // bot.command('/start', (ctx) => {
    //     ctx.reply('Hello!')
    // })

}).catch(error => console.log(error));
