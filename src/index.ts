import "reflect-metadata";
var app = require('./app');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

import {createConnection} from "typeorm";
import {User} from "./entity/User";

createConnection({
    type: "mysql",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    entities: [
        "src/entity/**/*.ts"
    ],
    migrations: [
        "src/migration/**/*.ts"
    ],
    subscribers: [
        "src/subscriber/**/*.ts"
    ],
    cli: {
        "entitiesDir": "src/entity",
        "migrationsDir": "src/migration",
        "subscribersDir": "src/subscriber"
    }
}).then(async connection => {
    console.log('DB Started ' + process.env.DB_HOST);

    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    const VkBot = require('node-vk-bot-api')
    const bot = new VkBot(process.env.VK_TOKEN)

    bot.command('/start', (ctx) => {
        ctx.reply('Hello!')
    })

}).catch(error => console.log(error));
