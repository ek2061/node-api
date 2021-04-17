const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const mongoose = require('mongoose')
const User = mongoose.model('users')
const keys = require('../config/keys')

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = keys.secretOrKey;

module.exports = passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        console.log(jwt_payload)
        User.findById(jwt_payload.id)
            .then(user => {  // 判斷帳戶是否存在
                if (user) {  //如果存在
                    return done(null, user)
                }
                return done(null, false)  //帳戶不存在
            })
            .catch(err => console.log(err))
    }));
}