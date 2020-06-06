import "reflect-metadata";
import {User} from "./User";
import {createConnection} from "typeorm"

var passport = require('passport')
var VKontakteStrategy = require('passport-vkontakte').Strategy;

createConnection().then(async connection => {
    passport.use(new VKontakteStrategy({
            clientID: process.env.VK_APP_ID,
            clientSecret: process.env.VK_APP_SECURE_KEY,
            callbackURL: process.env.VK_APP_CALLBACK_URL,
            apiVersion: '5.68',
        },

        async (_accessToken, _refreshToken, profile, done) => {
            console.log('profile');
            console.log(profile);
            try {
                const user = await connection.manager.findOne(User, {
                    where: {
                        vk_id: profile.id,
                    },
                });
                if (!user) {
                    // If the user isn't found in the database, return a message
                    return done(null, false, {message: 'User not found'});
                }
                console.log('user');
                console.log(user);

                // Send the user information to the next middleware
                return done(null, user, {message: 'Logged in Successfully'});
            } catch (error) {
                return done(error);
            }
        }
    ));

    passport.serializeUser(function (user, done) {
        done(null, user);
    });

    passport.deserializeUser(function (user, done) {
        done(null, user);
    });
}).catch(error => console.log(error));

export default passport;