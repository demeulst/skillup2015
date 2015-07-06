var port = 8080;
var express = require('express');
var bodyParser = require("body-parser");
var _ = require('lodash');

var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

var users = [
    {
        username: "mario",
        password: "mario",
        name: "Mario",
        games: [{ title: "Super Mario Bros. 3", beat: false }, { title: "Super Mario 64", beat: false }, { title: "Super Smash Bros. Melee", beat: false }]
    },
    {
        username: "luigi",
        password: "luigi",
        name: "Luigi",
        games: [{ title: "Super Mario Bros. 2", beat: false }, { title: "Luigi's Mansion", beat: false }, { title: "Mario Kart 64", beat: false }]
    }
];

var authenticatedUser;

app.post("/login", function (req, res) {
    var user = req.body;

    if (!user || !user.username || !user.password) {
        res.status(422).send();
    }

    var usernameMatch = _.find(users, function (u) {
        return u.username === user.username;
    });

    if (!usernameMatch || usernameMatch.password !== user.password) {
        res.status(401).send();
    } else {
        authenticatedUser = _.omit(usernameMatch, 'password');
        res.status(200).send(authenticatedUser);
    }
});

app.post("/logout", function (req, res) {
    authenticatedUser = null;

    res.status(200).send();
});


app.get("/users/current", function (req, res) {
    if (authenticatedUser) {
        res.status(200).send(authenticatedUser);
    }

    res.status(404).send();
});

app.listen(port);
console.log('Listening on port ' + port);