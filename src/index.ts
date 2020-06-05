import "reflect-metadata";
var app = require('./app');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const VkBot = require('node-vk-bot-api')
const bot = new VkBot(process.env.VK_TOKEN)

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
    console.log('DB Started');

    const users = await connection.manager.find(User);
    console.log("Loaded users: ", users);

    // console.log(process.env.TOKEN);

    // console.log("Inserting a new user into the database...");
    // const user = new User();
    // user.name = "Timber";
    // user.record_number = "Saw";
    // user.vk_id = '25';
    // await connection.manager.save(user);
    // console.log("Saved a new user with id: " + user.id);
    //
    // console.log("Loading users from the database...");

    //
    // console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
