var mongoose = require('mongoose');
var TeamModel = require('../models/team_model.js');

var Team = function(req, res) {
    this.request = req;
    this.response = res;

};

Team.prototype.getTeams = function() {

    var query = TeamModel.find({});
    return query;
}

Team.prototype.addTeam = function(req, res, next) {
    if (req.body.name) {
        var team = new TeamModel({ name: req.body.name, players: req.body.players });
        team.save(function(err, team) {
            if (err) return console.error(err);
        });
    }

    //   res.render('new-team');
}

module.exports = new Team();
