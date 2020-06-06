import {User} from "./entity/User";

var passport = require('passport')
var VKontakteStrategy = require('passport-vkontakte').Strategy;

passport.use(new VKontakteStrategy({
        clientID: process.env.VK_APP_ID,
        clientSecret: process.env.VK_APP_SECURE_KEY,
        callbackURL: process.env.VK_APP_CALLBACK_URL
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
                return done(null, false, {message: 'User not found'});
            }

            // Send the user information to the next middleware
            return done(null, user, {message: 'Logged in Successfully'});
        } catch (error) {
            return done(error);
        }
    }
    )
);

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

export default passport;