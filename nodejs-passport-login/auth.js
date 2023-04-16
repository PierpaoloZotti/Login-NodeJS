const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;


module.exports = function (passport) {

    passport.serializeUser((user, done) => {
        done(null, user.id);
    });

    passport.deserializeUser(async (id, done) => {
        try {
            const db = require('./db');
            const user = await db.findUserById(id);
            done(null, user);
        } catch (err) {
            done(err, null);
        }
    });

    passport.use(new LocalStrategy({
        usernameField: 'username',
        passwordField: 'password'
    },
        async (username, password, done) => {
            try {
                const db = require('./db');
                const user = await db.findUser(username);

                // usuário inexistente
                if (!user) { return done(null, false) }
                console.log('find user')
                console.log(user.password)
                // comparando as senhas
                const isValid = bcrypt.compareSync(password, user.password);
                console.log(isValid)
                if (!isValid) {
                    console.log('invalid password')
                    return done(null, false)
                }
                console.log(user);
                return done(null, user)
            } catch (err) {
                done(err, false);
            }
        }
    ));
}