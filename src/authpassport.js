var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
// var LinkedInStrategy=require('passport-linkedin-oauth2').Strategy;

// load up the user model
var User = require('./victimmodel');

// load the auth variables
var configAuth = require('./auth'); // use this one for testing

module.exports = function (passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id, function (err, user) {
            // console.log('user in deserilize',user);
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // =========================================================================

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
        function (req, email, password, done) {
            if (email)
                email = email.toLowerCase(); // Use lower-case e-mails to avoid case-sensitive e-mail matching

            // asynchronous
            process.nextTick(function () {
                // if the user is not already logged in:
                if (!req.user) {
                    User.findOne({ 'local.email': email }, function (err, user) {
                        // if there are any errors, return the error
                        if (err)
                            return done(err);

                        // check to see if theres already a user with that email
                        if (user) {
                            return done(null, false, req.flash('signupMessage', 'That email is already taken.'));
                        } else {

                            // create the user
                            var newUser = new User();

                            newUser.local.email = email;
                            newUser.local.password = newUser.generateHash(password);

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }

                    });
                    // if the user is logged in but has no local account...
                } else if (!req.user.local.email) {
                    // ...presumably they're trying to connect a local account
                    // BUT let's check if the email used to connect a local account is being used by another user
                    User.findOne({ 'local.email': email }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {
                            return done(null, false, req.flash('loginMessage', 'That email is already taken.'));
                            // Using 'loginMessage instead of signupMessage because it's used by /connect/local'
                        } else {
                            var user = req.user;
                            user.local.email = email;
                            user.local.password = user.generateHash(password);
                            user.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, user);
                            });
                        }
                    });
                } else {
                    // user is logged in and already has a local account. Ignore signup. (You should log out before trying to create a new account, user!)
                    return done(null, req.user);
                }

            });

        }));

    // =========================================================================
    // FACEBOOK ================================================================
    // =========================================================================
    var fbStrategy = configAuth.facebookAuth;
    fbStrategy.passReqToCallback = true;  // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    passport.use(new FacebookStrategy(fbStrategy,
        function (req, token, refreshToken, profile, done) {
            //  console.log('token ',token);
            //   console.log('state',req.query.state);
            //   console.log('email',req.query.em);
            //   console.log('req',req);
            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                //we are sending email from frontend to this route, empty state means signing up with facebook
                if (typeof req.query.state == 'undefined') {
                    if (!req.user) {

                        User.findOne({ 'facebook.id': profile.id }, function (err, user) {
                            if (err)
                                return done(err);

                            if (user) {

                                // if there is a user id already but no token (user was linked at one point and then removed)
                                if (!user.facebook.token) {
                                    user.facebook.token = token;
                                    user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                                    user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                                    user.save(function (err) {
                                        if (err)
                                            return done(err);

                                        return done(null, user);
                                    }).then(function () {
                                        console.log('saved');
                                    });
                                }

                                return done(null, user); // user found, return that user
                            } else {
                                // if there is no user, create them
                                var newUser = new User();
                                newUser.UserName = (profile.emails[0].value || '').toLowerCase();
                                newUser.facebook.id = profile.id;
                                newUser.facebook.token = token;
                                newUser.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                                newUser.facebook.email = (profile.emails[0].value || '').toLowerCase();

                                newUser.save(function (err) {
                                    if (err)
                                        return done(err);
                                    return done(null, newUser);
                                });
                            }
                        });

                    } else {
                        // user already exists and is logged in, we have to link accounts
                        var user = req.user; // pull the user out of the session

                        user.facebook.id = profile.id;
                        user.facebook.token = token;
                        user.facebook.name = profile.name.givenName + ' ' + profile.name.familyName;
                        user.facebook.email = (profile.emails[0].value || '').toLowerCase();

                        user.save(function (err) {
                            if (err)
                                return done(err);

                            return done(null, user);
                        });

                    }
                }
                //if state parameter is not empty it means, we are just updating data for localuser pushing his facbook id and token.
                else if (req.query.state !== '') {
                    // console.log('email for local is',req.query.state);
                    User.findOne({ 'local.email': req.query.state }, function (err, user) {
                        if (err)
                            return done(err);
                        if (user) {
                            // console.log('this is is my localuser',user);
                            user.test = 'jawad';
                            console.log('this is my user after test',user);
                            return done(null, user);
                        }


                    })
                }
            });

        }));
    //new strategy for localuser authenticating with facebook
    passport.use('mystrategy', new FacebookStrategy({
        clientID: '1723116131034123',
        clientSecret: '47f331cea0643159532f8d298c711392',
        callbackURL: 'https://botanyauth.herokuapp.com/auth/fb/callback',
        passReqToCallback: true
    }
        ,
        function (req, token, refreshToken, profile, done) {
           
            process.nextTick(function () {
                // console.log('req in seperateroute', req.query.state);
                //    console.log('profile',profile);
                User.findOne({ 'local.email': req.query.state }, function (err, user) {
                    if (err) {
                        return done(err);
                    }
                    if (user) {
                        // console.log('user in seperate route',user);
                        user.local.token=token;
                        user.local.id=profile.id;
                        user.save(function(err){
                            if(err){
                                return done(err);
                            }else{
                                return done(null,user);
                            }
                        })
                       
                    }
                })

            })
        }
    ));

    // =========================================================================
    // Linkedin ==================================================================
    // =========================================================================
    // var liStrategy = configAuth.linkedInAuth;
    // passport.use(new LinkedInStrategy({
    //     consumerKey: liStrategy.clientID,
    //     consumerSecret: liStrategy.consumerSecret,
    //     callbackURL: "http://127.0.0.1:3000/auth/linkedin/callback"
    //   },
    //   function(token, tokenSecret, profile, done) {
    //     User.findOrCreate({ linkedinId: profile.id }, function (err, user) {
    //       return done(err, user);
    //     });
    //   }
    // ));

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({
        clientID: configAuth.googleAuth.clientID,
        clientSecret: configAuth.googleAuth.clientSecret,
        callbackURL: configAuth.googleAuth.callbackURL,
        passReqToCallback: true // allows us to pass in the req from our route (lets us check if a user is logged in or not)

    },
        function (req, token, refreshToken, profile, done) {
            console.log("Its here ");
            // asynchronous
            process.nextTick(function () {

                // check if the user is already logged in
                if (!req.user) {

                    User.findOne({ 'UserName': req.body.email }, function (err, user) {
                        if (err)
                            return done(err);

                        if (user) {

                            // if there is a user id already but no token (user was linked at one point and then removed)
                            if (!user.google.token) {
                                user.google.token = token;
                                user.google.name = profile.displayName;
                                user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                                user.save(function (err) {
                                    if (err)
                                        return done(err);

                                    return done(null, user);
                                });
                            }

                            return done(null, user);
                        } else {
                            var newUser = new User();
                            newUser.UserName = (profile.emails[0].value || '').toLowerCase();
                            newUser.google.id = profile.id;
                            newUser.google.token = token;
                            newUser.google.name = profile.displayName;
                            newUser.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                            newUser.save(function (err) {
                                if (err)
                                    return done(err);

                                return done(null, newUser);
                            });
                        }
                    });

                } else {
                    // user already exists and is logged in, we have to link accounts
                    var user = req.user; // pull the user out of the session

                    user.google.id = profile.id;
                    user.google.token = token;
                    user.google.name = profile.displayName;
                    user.google.email = (profile.emails[0].value || '').toLowerCase(); // pull the first email

                    user.save(function (err) {
                        if (err)
                            return done(err);

                        return done(null, user);
                    });

                }

            });

        }));

}