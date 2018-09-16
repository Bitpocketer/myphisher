var request = require('request-promise');
module.exports = function (app, passport) {

    // normal routes ===============================================================

    // PROFILE SECTION =========================
    app.get('/profile', isLoggedIn, function (req, res) {
        res.json(req.user);
    });


    // =============================================================================
    // LocalLogin ==================================================
    // =============================================================================

    app.get('/login', passport.authenticate('local', {
        successRedirect: 'http://127.0.0.1:4000/createbot', 
        failureRedirect: 'http://127.0.0.1:4000/signin'
    }));


    // =============================================================================
    // AUTHENTICATE (FIRST LOGIN) ==================================================
    // =============================================================================

    // facebook -------------------------------


    
    app.get('/failure',function(req,res){
        console.log('failure occured',req);
    })
    // twitter --------------------------------

    // send to twitter to do the authentication



    // google ---------------------------------

    // send to google to do the authentication
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/oauth/callback', passport.authenticate('google', { failureRedirect: '/' }), function (req, res) {
        res.redirect('/googlesuccess');
    });

    app.get('/googlesuccess', function (req, res) {
        console.log('googlesuccess');
        console.log(req.user);

        var name = req.user.google.name;
        //redirect to 8 ball pool here
        res.redirect('https://botany-frontend.herokuapp.com/createbot/?name=' + name);

    })
    //Linkedin ..........................................
    // app.get('/auth/linkedin',passport.authenticate('linkedin'));
    // app.get('http://127.0.0.1:3000/auth/linkedin/callback',passport.authenticate('linkedin',{failureRedirect:'/'}),function(req,res){
    //     res.redirect('linkedinsuccess');
    // })
    //
    app.get('/terminatesession',function(req,res){
        console.log(req.session);
        req.session.destroy(function(err){
            console.log('session terminated');
        })
    })
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
