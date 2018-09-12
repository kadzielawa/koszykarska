var express = require('express');
var router = express.Router();
var team = require('../modules/team');
var match = require('../modules/match');
/* GET admin page. */
router.get('/', function(req, res, next) {
    res.render('admin');
});
/* GET new match page. */
router.get('/new-match', function(req, res, next) {
    var teams = team.getTeams();
    teams.then(function(teams) {
        res.render('new-match', { teams: teams });
    });
});

/* POST new match */
router.post('/new-match', function(req, res, next) {
    match.addMatch(req);
    res.redirect('/admin/new-match');
});

/* GET new team page. */
router.get('/new-team', function(req, res, next) {
    res.render('new-team');
});

/* POST new team */
router.post('/new-team', function(req, res, next) {
    team.addTeam(req);
    res.render('new-team');
});



router.post('/new-team', team.addTeam);

module.exports = router;
