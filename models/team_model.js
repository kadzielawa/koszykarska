var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var MongoMapper = require('../modules/mongo-mapper');
var Team = new Schema({
    id: Number,
    name: String,
    players: { type: Array, set: splitPlayers }
});

var sequence = MongoMapper.sequenceGenerator('team');


Team.pre('save', function(next) {
    var doc = this;
    // get the next sequence
    sequence.next(function(nextSeq) {
        doc.id = nextSeq;
        next();
    });
});

function splitPlayers(players) {
    var playersArray = players.split(",");
    return playersArray

}
module.exports = mongoose.model('teams', Team);
