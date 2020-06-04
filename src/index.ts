import "reflect-metadata";

var express = require('express');
var app = express();

const VkBot = require('node-vk-bot-api')
// const bot = new VkBot(process.env.TOKEN)

import {createConnection} from "typeorm";
import {User} from "./entity/User";

createConnection().then(async connection => {

    console.log(process.env.TOKEN);

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

app.get('/', function(req, res) {
    res.send('hello world');
});