import "reflect-metadata";

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var express = require('express');
var app = express();

app.listen(process.env.PORT, function () {
    console.log('Example app listening on port 5000!');
});

const VkBot = require('node-vk-bot-api')
const bot = new VkBot(process.env.VK_TOKEN)

import {createConnection} from "typeorm";
import {User} from "./entity/User";

app.get('/', function(req, res) {
    console.log(req);
    console.log('/');
    res.send('cacf322a');
});

app.post('/confirmVK', function(req, res) {
    if(req.query === { "type": "confirmation", "group_id": 166439257 }) {
        res.send('cacf322a');
    }
});


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
    // const users = await connection.manager.find(User);
    // console.log("Loaded users: ", users);
    //
    // console.log("Here you can setup and run express/koa/any other framework.");

}).catch(error => console.log(error));
