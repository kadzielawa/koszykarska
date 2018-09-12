var mongoose = require('mongoose');
var passport = require('passport');

var User = function(req, res) {
    this.request = req;
    this.response = res;

};

User.prototype.login = function(req, res) {
    console.log(req);
    //res.render("login");
}
User.prototype.myAccount = function(req, res) {
    if (typeof req.user !== 'undefined') {
        res.render("account", { req: req });
    } else {
        res.redirect('/login');
    }
}
User.prototype.register = function(req, response) {
    //handle register user 
    if (!Utils.isEmptyObject(req.query)) {
        if (req.query.username && req.query.password && req.query.email) {
            var create = createUser(req, response);
            response.json({ message: "Utworzono pomyślnie użytkownika!" });

        } else {
            response.json({ message: "Użytkownik nie został utworzony!" });
        }
        return false;
    }
    response.render("register");
}


function createUser(req, res) {
    var User = require('../models/user_model.js');
    User.register(new User({ username: req.query.username }), req.query.password, function(err, account) {
        if (err) {
            return res.render('register', { account: account });
            return false;

        }

        passport.authenticate('local')(req, res, function() {
            res.redirect('/');
        });
    });
}

module.exports = new User();
