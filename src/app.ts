if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var express = require('express');
var app = express();
import passport from './auth';
import bot from './soc-net';

app.use(express.static('public'));
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'pug');

// ______ROUTES________
app.get('/', function (req, res) {
    if (req.isAuthenticated()) {
        console.log(req.user);
        res.render('profile', {user: req.user});
    } else {
        res.render('index');
    }
});
app.post('/vk-hook', bot.webhookCallback);

app.get('/auth/vkontakte',
    passport.authenticate('vkontakte'),
    function (req, res) {}
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