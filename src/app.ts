if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

import {createConnection, getRepository} from "typeorm"
import {User} from "./entity/User"
import {Lesson} from "./entity/Lesson"
import {ScheduleDay} from "./entity/ScheduleDay"

const express = require('express');
const bodyParser = require('body-parser')
const app = express();
import passport from './auth';
import bot from './soc-net';

app.use(express.static('public'));
app.use(express.json())
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'pug');

// ______ROUTES________
app.get('/', async function (req, res) {
    if (process.env.NODE_ENV !== 'production') {
        const user = await getRepository(User).findOne(1);
        res.render('profile', {user: user});
    } else {
        if (req.isAuthenticated()) {
            const user = await getRepository(User).findOne(req.user.id, {relations: ["record"]});
            res.render('profile', {user: user});
        } else {
            res.render('index');
        }
    }
});
app.get('/schedule/', async function (req, res) {
    if (process.env.NODE_ENV !== 'production') {
        const user = await getRepository(User).findOne(1);
        res.redirect('/schedule/mon');
    } else {
        if (req.isAuthenticated()) {
            res.redirect('/schedule/mon');
        } else {
            res.redirect('/');
        }
    }
});
app.get('/schedule/:day', async function (req, res) {
    // const user = req.user;
    const user = await getRepository(User).findOne(req.user.id, {relations: ["record"]});
    req.user = user

    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat'];

    if (req.isAuthenticated()) {
        if (!days.includes(req.params.day)) {
            req.params.day = 'mon';
        }
        const scheduleDays = await getRepository(ScheduleDay).manager.find( ScheduleDay, { relations: ["lessons"], where: {user: user, day: req.params.day} }).then((result) => {
            res.render('schedule', {day: req.params.day, user: user, scheduleDays: result});
        });
    } else {
        res.redirect('/');
    }
});
app.post('/schedule/save', async function (req, res) {
    // const user = req.user;
    const user = await getRepository(User).findOne(1);

    const lessonObj = await getRepository(Lesson);
    const scheduleDayObj = await getRepository(ScheduleDay);

    let dayStr = 'mon';
    Object.keys(req.body).map((day) => {
        dayStr = day;
        Object.keys(req.body[day]).map(async (numerator) => {
            let scheduleDay = await scheduleDayObj.manager.findOne(ScheduleDay, {where: {user: user, numerator:numerator === 'numerator', day: day}})

            if(!scheduleDay) {
                scheduleDay = new ScheduleDay();
                scheduleDay.numerator = numerator === 'numerator';
                scheduleDay.user = user;
            }

            scheduleDay.day = day;

            await scheduleDayObj.manager.save(scheduleDay);

            Object.keys(req.body[day][numerator]).map(async (time, index) => {
                let lesson = await lessonObj.manager.findOne(Lesson, {where: {scheduleDay: scheduleDay, time:time}})

                if(!lesson) {
                    lesson = new Lesson();
                    lesson.number = index + 1;
                    lesson.time = time;
                    lesson.scheduleDay = scheduleDay;
                }

                lesson.name = req.body[day][numerator][time].name;
                lesson.place = req.body[day][numerator][time].place;

                await lessonObj.manager.save(lesson);
            })
        })
    });

    res.redirect('/schedule/'+dayStr);
});

app.post('/vk-hook', bot.webhookCallback);
app.get('/auth/vkontakte',
    passport.authenticate('vkontakte'),
    function (req, res) {
    }
);
app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', {failureRedirect: '/'}),
    function (req, res) {
        res.redirect('/');
    }
);
app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
// ______ROUTES________

bot.startPolling();

export default app;