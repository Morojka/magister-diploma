if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

var express = require('express');
var app = express();
import passport from './auth';

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());
app.set('view engine', 'pug');

// ______ROUTES________
app.get('/', function (req, res) {
    res.render('index', {title: 'Hey', message: 'Hello there!'});
});
app.post('/confirmVK', function (req, res) {
    res.send('b838b0af');
});

app.get('/auth/vkontakte',
    passport.authenticate('vkontakte'),
    function (req, res) {
        // The request will be redirected to Facebook for authentication, so this
        // function will not be called.
    }
);

app.get('/auth/vkontakte/callback',
    passport.authenticate('vkontakte', {failureRedirect: '/login'}),
    function (req, res) {
        res.redirect('/');
    }
);

app.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/');
});
// ______ROUTES________

export default app;