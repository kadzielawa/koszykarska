var express = require('express');
var router = express.Router();
var user = require('../modules/user');
var passport = require('passport');

/* GET home page. */
router.get("/", function(req, res) {
    res.render("index");
});
router.get("/matches", function(req, res) {
    res.render("matches");
});
router.get('/match/:id', function(req, res) {
    res.render('match', { match_id: req.params.id });
});


router.get('/account', user.myAccount);

router.get('/register', user.register);

router.get('/login', function(req, res) {
    res.render('login', user.login({ user: req.user }));
});
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});


module.exports = router;
