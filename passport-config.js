const User = require('./models/User');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');

/**@param {import('passport')} passport */
module.exports = function (passport) {
    passport.use(new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
        try {
            const user = await User.findOne({ email })
            if (user) {
                const found = await bcrypt.compare(password, user.encryptedPassword);
                if (found)
                    return done(null, user)
                else
                    return done(null, false, { message: 'Incorrect password' })
            } else {
                return done(null, false, { message: 'No user found' })
            }
        } catch (error) {
            console.error(error)
            return done(error)
        }
    }))

    passport.serializeUser((user, done) => {
        done(null, user.id)
    })

    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => {
            done(err, user)
        })
    })
}