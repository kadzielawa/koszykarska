var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoMapper = require('../modules/mongo-mapper');
var teams = mongoose.model('teams');

var Match = new Schema({
    id: Number,
    team1: { type: [Schema.Types.Mixed], set: getTeam },
    team2: { type: [Schema.Types.Mixed], set: getTeam },
    date: String,
});

var sequence = MongoMapper.sequenceGenerator('match');

function getTeam(team) {

    return getJedisQuery(team, function(err, team) {
        console.log(team.id);
        return teams;
    });
}

function getJedisQuery(team, callback) {
    var TeamModel = require('../models/team_model.js');
    var query = TeamModel.find({ name: team },
        function(err, teams) {
            if (err) {
                callback(err, null);
            } else {
                callback(null, teams);
            }
        });

}

Match.pre('save', function(next) {
    var doc = this;
    // get the next sequence
    sequence.next(function(nextSeq) {
        doc.id = nextSeq;
        next();
    });
});


module.exports = mongoose.model('match', Match);
