import {User} from "./entity/User";

var express = require('express');
var app = express();
var passport = require('passport')
var VKontakteStrategy = require('passport-vkontakte').Strategy;

app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());

app.set('view engine', 'pug');
app.listen(process.env.PORT, function () {
    console.log('Example app listening on port 5000!');
});

passport.use(new VKontakteStrategy({
        clientID:     process.env.VK_APP_ID,
        clientSecret: process.env.VK_APP_SECRET,
        callbackURL:  process.env.VK_APP_CALLBACK_URL
    },
    // eslint-disable-next-line func-names
    async (_accessToken, _refreshToken, profile, done) => {
        try {
            const user = await User.findOne({
                where: {
                    vk_id: profile.id,
                },
            });
            if (!user) {
                // If the user isn't found in the database, return a message
                return done(null, false, { message: 'User not found' });
            }

            // Send the user information to the next middleware
            return done(null, user, { message: 'Logged in Successfully' });
        } catch (error) {
            return done(error);
        }
    }
    )
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

// ______ROUTES________
app.get('/', function (req, res) {
    res.render('index', {title: 'Hey', message: 'Hello there!'});
});
app.post('/confirmVK', function (req, res) {
    if (req.query === {"type": "confirmation", "group_id": 166439257}) {
        res.send('2470154a');
    }
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

export default {app}