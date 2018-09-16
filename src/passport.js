var mongoose = require('mongoose');
var userProfile = require('./victimmodel');

//lodash for easy manipulation of arrays, strings etc
var _ = require('lodash');

module.exports = function(passport) {

    var passportJWT = require("passport-jwt");
    var extractJwt = passportJWT.ExtractJwt;
    var jwtStrategy = passportJWT.Strategy;

    // Strategy Building
    var jwtOptions = {};
    jwtOptions.jwtFromRequest = extractJwt.fromAuthHeaderAsBearerToken();
    jwtOptions.secretOrKey = 'Locopixel';

    var strategy = new jwtStrategy(jwtOptions, function(jwt_payload, next) {
        console.log('payload received', jwt_payload);
        var user = userProfile[_.findIndex(userProfile, { id: jwt_payload.id })];
        if (user) {
            next(null, user);
        } else {
            next(null, false);
        }
    });
    passport.use(strategy);
}

