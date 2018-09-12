var mongoose = require('mongoose');
var MatchModel = require('../models/match_model.js');


function getRandom(items) {
    return Math.floor(Math.random() * items.length);
}

function getTimeTakenMessage(team) {

    var TimeTaken = ["Trener drużyny " + team.name + " poprosił o czas"];
    return TimeTaken[getRandom(TimeTaken)];
}

function getMakeImpressionMessage(team) {

    var Impression = ["W tym momencie przechodzi meksykańska fala. Niesamowita atmosfera na trybunach! ",
        "Mecz stoi na najwyższym poziomie, kibice głośnym Alllea Oooo podgrzewają tylko atmosferę na boisku!",
        team.name + " w tym momencie przy koszu przeciwnika rozgrywając powoli akcję ",
        team.name + " - oni posiadają szóstego zawodnika, jest nim przybyła publiczność na to spotkanie!",
        team.name + " właśnie przy piłce, gra pasywna przynosi trochę rozluźnienia w szeregach."
    ];
    return Impression[getRandom(Impression)];
}

function getFailShootMessage(team, player) {

    var FailShoot = ["Próba " + player + " zakończona niecelnym rzutem i stratą piłki",
        player + " nie trafił z półdystansu.",

    ];
    return FailShoot[getRandom(FailShoot)];
}

function getFreeThrowMessage(team, player, points) {
    //jesli trafi z osobistych
    var FreeThrow = [];

    if (points == 1) {
        FreeThrow = ["Z linii rzutu punktów osobistych nie myli się " + player,
            player + " trafia z rzutów osobistych",

        ];
    } else {
        FreeThrow = ["Próba z linii rzutu punktów osobistych " + player + " zakończona niecelnym rzutem",
            player + " nie trafił z rzutów osobistych",

        ];
    }

    return FreeThrow[getRandom(FreeThrow)];
}

function getScoreMessage(team, player, points) {

    var Scores = ["Z wyskoku za " + points + " punkty trafia " + player,
        "Wejście pod kosz i punkty " + player,
        "Spod kosza skutecznie " + player,
        "Stanął na linii " + player + " , rzut zaliczony za " + points + " punkty.",
        "Świetna gra " + player + " i kolejne " + points + " zapisane na jego koncie.",
        "Cóż to była za akcja " + team.name + "! " + player + " znalazł się pod koszem, zebrał i trafił za dwa!",
        "Z własnej połowy próbował jeszcze rzucać " + player + ", ale nie trafił.",
        "Fantastyczna kontra " + team.name + "! " + player + " świetnie dojrzał kolegę nieopodal kosza, a ten trafił bez najmniejszych problemów!"
    ];
    return Scores[getRandom(Scores)];
}

function getSubstituteMessage(team, playerIn, playerOut) {

    var Substitutes = ["Zmiana w drużynie " + team.name + ", schodzi " + playerOut + " wchodzi " + playerIn + ".",
        "Za zawodnika " + playerOut + " wchodzi " + playerIn,
        "W miejsce " + playerOut + " wchodzi " + playerIn
    ];
    return Substitutes[getRandom(Substitutes)];
}

function getFoulMessage(team, player, freeThrows) {
    //jeśli rzuty osobiste
    var Fouls = [];
    if (freeThrows == 1) {
        Fouls = ["Będą rzuty osobiste! " + player + " fauluje przy koszu.",
            player + " fauluje i będą rzuty!",
        ];
    } else {
        Fouls = [" " + player + " faulowany. " + team.name + " zaczyna wznowieniem gry od linii bocznej.",
            "Zupełnie nie poradził sobie z kryciem " + player + " i musiał ratować swój zespół grą faul.",
            "Bardzo słaba gra " + player + ", brzydki faul."
        ];
    }

    return Fouls[getRandom(Fouls)];
}


function getLoseMessage(team, player) {

    var Lose = ["Chciał dobrze, ale wyszło jak zawsze, w skutek czego " + player + " stracił piłkę na rzecz przeciwnika.",
        "Nieudany drybling " + player + ", przeciwnicy skrzętnie to wykorzystują przejmując piłkę",
        "Strata piłki przez " + player + ".",
        "Szybko chciała odpowiedzieć drużyna " + team.name + ", ale " + player + " popełnił błąd kroków",
        "W ataku " + team.name + ", ale " + player + " popełnił błąd podwójnego kozłowania",

    ];

    return Lose[getRandom(Lose)];
}



/**
 * [Match description]
 * @param {[type]} team1  [description]
 * @param {[type]} team2  [description]
 * @param {[type]} id     [description]
 * @param {[type]} active [description]
 */
function Match(team1, team2, id, active) {
    this.team1 = team1;
    this.team2 = team2;
    this.id = id;
    this.active = active;
    if (active)
        this.initialize();
};

Match.prototype = {
    id: 0,
    active: false,
    minute: 0,
    second: 0,
    timestop: 0,
    team1: { "name": "", "players": [] },
    team2: { "name": "" },
    quart: 1,
    countOfFreeThrows: 0,
    //druzyna 1
    players1: [],
    //druzyna 2
    players2: [],
    result1: 0,
    result2: 0,
    onBall: {}, // drużyna przy piłce
    events: [],

    initialize: function() {

        this.team1.timesTaken = 0;
        this.team2.timesTaken = 0;
        this.players1 = this.getFirstFivers(this.team1);
        this.players2 = this.getFirstFivers(this.team2);
        this.events = [];
        //system rozgrywki
        this.play();
    },

    /**
     * get random first five players in array
     * 
     * @param  {Object} team desired team
     * @return {Array}      desired five players from target team
     */
    getFirstFivers: function(team) {
        var fivePlayers = [];
        for (var i = 0; i <= 5; i++) {
            var isUnique = 1;
            while (isUnique) {
                var randomPlayer = team.players[getRandom(team.players)];
                for (var i = 0; i <= fivePlayers.length; i++) {
                    if (fivePlayers[i] == randomPlayer) {
                        isUnique = 0;
                        break;
                    }
                };
                if (isUnique == 1) {
                    fivePlayers.push(randomPlayer);
                    break;
                }
            };
        }
        return fivePlayers;
    },

    /**
     * [get reserver player]
     * @param  {[Array]} team array with current player's team
     * @return {[String]} reserve Player
     */
    getSubstiter: function(team, currentPlayers) {
        var flag = 1;
        while (flag) {
            var randomPlayer = team.players[getRandom(team.players)];
            for (var i = 0; i <= currentPlayers.length; i++) {
                if (currentPlayers[i] == randomPlayer) {
                    break;
                }
                if (flag == 1 && currentPlayers.length == i) {
                    currentPlayers.push(randomPlayer);
                    return randomPlayer;
                }
            }
        };
    },
    /**
     * [determine which player should be draft from game]
     * @param  {[Array]} currentPlayers [description]
     * @param  {[String]} playerIn       [description]
     * @return {[String]} playerOut               [description]
     */
    getPlayerOut: function(currentPlayers, playerIn) {
        var that = this;
        var flag = 1;
        while (flag) {
            var index = getRandom(currentPlayers);
            if (currentPlayers[index] != playerIn) {
                var playerOut = currentPlayers[index];
                currentPlayers.splice(index, 1);
                break;
            }
        }

        return playerOut;
    },
    /**
     * determine which action should be play 
     * @return {[time]} how many seconds game should be stopped
     */
    generateAction: function() {
        var that = this;
        var los = Math.floor((Math.random() * 5) + 1);
        var time = 0;
        var teamOnBall = that.onBall;
        that.timestop = 0;
        switch (los) {
            case 1:
                that.score(teamOnBall, 3);
                break;
            case 2:
                that.lose(teamOnBall);
                break;
            case 3:
                //czy rzuty osobiste czy nie
                var freeThrows = Math.floor((Math.random() * 2) + 1);
                that.foul(teamOnBall, freeThrows);
                if (freeThrows == 1) {
                    that.countOfFreeThrows = Math.floor((Math.random() * 2) + 1);
                    that.freeThrow();
                    time = 20;
                }
                break;
            case 4:
                that.timeTaken(teamOnBall);
                //to do - event 
                that.timestop = 1;
                time = 4;
                break;
            case 5:
                that.makeImpression(teamOnBall);
                break;
        }
        // czy zmiana powinna nastąpić
        var substitute = Math.floor((Math.random() * 5) + 1);
        if (substitute == 1)
            that.getSubstitute(that.getRandomTeam());
        return time;
    },

    start: function() {
        //umieszczamy informacje na tablicy
        this.events.push({ message: "W dzisiejszym meczu spotkają się dwie drużyny: " + this.team1.name + " vs. " + this.team2.name, minute: this.minute, second: this.second });
        //losujemy druzyne ktora wygrywa rozpoczecie
        var team = this.getRandomTeam();
        this.onBall = team;
        this.events.push({ message: "Sędzia podrzuca piłkę, w powietrzu lepsza okazała się drużyna: " + team.name, minute: this.minute, second: this.second });

    },

    setDelay: function() {

        var that = this;
        var space = that.setSpaceBetweenActions();
        var time = 0;
        that.timestop = 0;
        //zapobiega natychmiastowemu wywołaniu generate action
        //  if(that.timestop == 0) {
        if (that.second != 0) {
            time = that.generateAction();
            if (time != 0)
                space = time;
        }
        space = space * 1000; //zamieniamy sekundy na milisekundy
        timer = setTimeout(that.setDelay.bind(that), space);

    },
    play: function() {
        var that = this;
        that.start();

        that.setDelay.call(that);

        that.setTime();

        setInterval(function() {
            that.getTime();
            that.checkQuarte();
            that.setTime();
        }, 1000);

    },

    checkQuarte: function() {
        var that = this;
        var time = 0;
        if ((that.minute == "10" || that.minute == "20" || that.minute == "30" || that.minute == "40") && that.second == "00") {
            if (that.events[that.events.length - 1].type != 'endOfQuarte') {
                that.events.push({ message: "Koniec kwarty " + that.quart + "! Wracamy za 5 minut!", minute: this.minute, second: this.second, type: "endOfQuarte" });
                that.quart++;
                time = 5;
                that.timestop = 1;
            }
        }
        if (that.timestop == 1) {
            time--;
            if (time == 0)
                that.timestop = 0;
        }
    },
    setSpaceBetweenActions: function() {
        var space = Math.floor((Math.random() * 5) + 1);
        return space;
    },
    setTime: function() {
        if (this.timestop)
            return;
        this.second++;

        if (this.second == 60) {
            this.second = 0;
            this.minute++;
        }
        this.minute = this.minute.toString();

        if (this.minute <= 9 && this.minute.length < 2)
            this.minute = "0" + this.minute;
        if (this.second <= 9)
            this.second = "0" + this.second;
    },

    /**
     * return currently time of game
     * @return {[type]} [description]
     */
    getTime: function() {
        var time = "[" + this.minute + ":" + this.second + "]";
        //return time;
        console.log(time);
    },
    getRandomTeam: function() {
        var randomNumber = Math.floor((Math.random() * 2) + 1);
        if (randomNumber == 1)
            return this.team1;
        else
            return this.team2;
    },
    getAction: function(type, team, points, freeThrows) {
        var that = this;
        switch (type) {
            case 'score':
                var player = that.getPlayer(team);
                return getScoreMessage(team, player, points);
                break;
            case 'foul':
                var player = that.getPlayer(team);
                return getFoulMessage(team, player, freeThrows);
                break;
            case 'lose':
                var player = that.getPlayer(team);
                that.onBall = that.getOpponent(team);
                return getLoseMessage(team, player);
                break;
            case 'freeThrow':
                var player = that.getPlayer(team);
                return getFreeThrowMessage(team, player, points);
                break;
            case 'timeTaken':
                return getTimeTakenMessage(team);
                break;
            case 'impression':
                return getMakeImpressionMessage(team);
                break;
            case 'substitute':
                var currentPlayers = team.name == that.team1.name ? that.players1 : that.players2;
                var playerIn = that.getSubstiter(team, currentPlayers);
                var playerOut = that.getPlayerOut(currentPlayers, playerIn);
                return getSubstituteMessage(team, playerIn, playerOut);
                break;
            case 'failShoot':
                var player = that.getPlayer(team);
                //to do-> dorobić możliwość zbiórki przez obie drużyny
                that.onBall = that.getOpponent(team);
                return getFailShootMessage(team, player);
                break;
            default:
                return "default";
        }
    },
    getPlayer: function(team) {
        if (team.name == this.team1.name)
            return this.players1[getRandom(this.players1)];
        else
            return this.players2[getRandom(this.players2)];
    },
    getOpponent: function(team) {
        if (team.name == this.team1.name)
            return this.team2
        else
            return this.team1;
    },
    freeThrow: function() {
        var that = this;
        that.timestop = 1;
        if (that.countOfFreeThrows > 0) {
            if (typeof timerFreeThrow != 'undefined') {
                that.countOfFreeThrows--;
                //losuje celność rzutu
                var point = Math.floor((Math.random() * 2) + 1);
                var message = that.getAction('freeThrow', that.onBall, point);
                //jeśli trafi, dodajemy punkty druzynie
                type = '';
                if (point == 1) {
                    if (that.onBall.name == that.team1.name)
                        this.result1 = this.result1 + point;
                    else
                        this.result2 = this.result2 + point;
                    type = "freeThrows"; //ustawiamy, że trafił i puszczamy dzwiek
                }
                console.log(message);
                that.events.push({ message: message, minute: this.minute, second: this.second, type: type });
            }
            timerFreeThrow = setTimeout(that.freeThrow.bind(that), 5000);
        } else {
            timerFreeThrow = undefined;
            that.countOfFreeThrows = 0;
            that.timestop = 0;
            that.onBall = that.getOpponent(that.onBall);
        }
    },

    getSubstitute: function(team) {
        var message = this.getAction('substitute', team);
        console.log(message);
        this.events.push({ message: message, minute: this.minute, second: this.second });
    },
    foul: function(team, freeThrows) {
        this.onBall = this.getOpponent(team);
        var message = this.getAction('foul', team, '', freeThrows);
        console.log(message);
        this.events.push({ message: message, minute: this.minute, second: this.second });
    },

    addMatch: function(req) {
        if (req.body) {
            var match = new MatchModel({ date: req.body.date, team1: req.body.team1, team2: req.body.team2 });
            match.save(function(err, match) {
                if (err) return console.error(err);
            });
        }
    },
    timeTaken: function() {
        var teamTimeTaken = {};

        if (this.team1.timesTaken >= 2 && this.team2.timesTaken >= 2) {
            this.generateAction();
            return false;
        } else {
            if (this.team1.timesTaken < 2 && this.team2.timesTaken >= 2) {
                teamTimeTaken = this.team1;
                this.team1.timesTaken++;
            } else if (this.team1.timesTaken >= 2 && this.team2.timesTaken) {
                teamTimeTaken = this.team2;
                this.team2.timesTaken++;
            } else {
                var teamNo = Math.floor((Math.random() * 2) + 1);
                if (teamNo == 1) {
                    teamTimeTaken = this.team1;
                    this.team1.timesTaken++;
                } else {
                    teamTimeTaken = this.team2;
                    this.team2.timesTaken++;
                }
            }
        }

        var message = this.getAction('timeTaken', teamTimeTaken);
        console.log(message);
        this.events.push({ message: message, minute: this.minute, second: this.second, type: "timeTaken" });
    },
    lose: function(team) {
        var message = this.getAction('lose', team);
        console.log(message);
        this.events.push({ message: message, minute: this.minute, second: this.second });
    },
    failShoot: function(team) {
        var message = this.getAction('failShoot', team);
        console.log(message);
        this.events.push({ message: message, minute: this.minute, second: this.second });
    },
    makeImpression: function(team) {
        var message = this.getAction('impression', team);
        console.log(message);
        this.events.push({ message: message, minute: this.minute, second: this.second });
    },
    score: function(team, points) {
        if (team.name == this.team1.name)
            this.result1 = this.result1 + points;
        else
            this.result2 = this.result2 + points;
        this.onBall = this.getOpponent(team); //drużyna zdobyła punkty więc przekazujemy piłkę przeciwnikowi
        var message = this.getAction('score', team, points);
        console.log(message);
        this.events.push({ message: message, minute: this.minute, second: this.second, type: "score" });
    }
}

var Schedule = [{
        //1 mecz
        id: 199,
        team1: {
            name: "Castorama",
            id: 24319,
            offensive: 40,
            defence: 34,
            posession: 49,
            shoots: 52,
            players: ["Jakub Kądzielawa", "ccc", "Kamil Popławski", "eee", "yyyy",
                "rrrr", "Bggg", "zzzz"
            ]
        },
        team2: {
            name: "Obsessive",
            id: 32543,
            offensive: 49,
            defence: 48,
            posession: 55,
            shoots: 52,
            players: ["xxxx", "ttt", "bbbb", "vvvv", "zzz",
                "nnn", "Anna hhhh", "xxx"
            ]
        },
        date: "2016-06-17 00:59"
    }, {
        //2 mecz
        id: 200,
        team1: {
            name: "Los Angeles Clippers",
            id: 532661,
            offensive: 11,
            defence: 67,
            posession: 33,
            shoots: 33,
            players: ["Blake Griffin", "Paul Pierce", "Branden Dawson", "Jamal Crawford", "Jeff Ayres",
                "DeAndre Jordan", "Chris Paul", "CJ Wilcox"
            ]
        },
        team2: {
            name: "Houston Rockets",
            id: 154532,
            offensive: 38,
            defence: 55,
            posession: 33,
            shoots: 65,
            players: ["Josh Smith", "Donatas Motiejunas", "Dwight Howard", "Marcus Thorton", "Ty Lawson",
                "Montrezl Harrel", "KJ McDaniels", "Jason Terry"
            ]
        },
        date: "2016-03-27 23:15"
    }
    /*,
                    //3 mecz
                    {
                        id: 201, 
                        team1: {
                            name: "Chicago Bulls",
                            id: 543214,
                            offensive: 40,
                            defence: 43, 
                            posession: 49,
                            shoots: 52
                        },
                        team2: {
                            name: "Boston Celtics",
                            id:646542,
                            offensive: 51,
                            defence: 64, 
                            posession: 51,
                            shoots: 76
                        }, 
                        date: "16.12.2015 00:52"
                    }*/
];

var Matches = [];

//@arg: obiekt w którym zawarty jest mecz -> następuje sprawdzenie czy mecz powinien się rozpocząć czy nie.
var setMatch = function(scheduleMatch) {
    if (new Date() > new Date(scheduleMatch.date)) {
        var meczyk = new Match(scheduleMatch.team1, scheduleMatch.team2, scheduleMatch.id, true);
    } else {
        meczyk = new Match(scheduleMatch.team1, scheduleMatch.team2, scheduleMatch.id, false);
    }
    Matches.push(meczyk);
}

setInterval(function() {
    var current = new Date();
    var month = current.getMonth() + 1 < 10 ? '0' : '';
    month += current.getMonth() + 1;
    var hours = current.getHours() < 10 ? '0' : '';
    hours += current.getHours();
    var minute = current.getMinutes() < 10 ? '0' : '';
    minute += current.getMinutes();
    var currentDate = current.getDate() + "." + month + "." + current.getFullYear();
    var currentTime = hours + ":" + minute;
    //iterujemy po każdym meczu w terminarzu, wkładamy do tablicy Matches każdy mecz i jeśli czas rozpoczęcia
    //jest mniejszy od czasu aktualnego to wstawiamy mecz z właściwością active na true;
    //jeśli nie jest mniejszy to wstawiamy mecz z właściwością false i za każdym razem sprawdzamy ten war
    Schedule.forEach(function(a, b) {
        if (Matches.length == 0) {
            setMatch(a);
        }
        for (var i = Matches.length - 1; i >= 0; i--) {
            if (Matches[i].id === a.id) {
                if (Matches[i].active === false) {
                    if (new Date() > new Date(a.date)) {
                        var meczyk = new Match(a.team1, a.team2, a.id, true);
                        Matches[i] = meczyk;
                    }
                }
                return;
            }
            if (i === 0) {
                setMatch(a);
            }
        }
    });
}, 1000);

setInterval(function() {
    io.sockets.emit('results', Matches);

}, 1000);

module.exports = new Match();
