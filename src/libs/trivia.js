var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
let correctAnswerThreshold = 5;

let triviaChannel;
let currentQuestion = "";
let currentAnswer = "";
let running = false;

let scores = new Map();

this.startTrivia = function (msg) {
    if (!running) {
        running = true;
        triviaChannel = msg.channel;
        triviaChannel.sendMessage("Trivia game started");
        getQuestionAndPost();
    } else {
        msg.reply("A trivia game is already in progress!");
    }
};

this.stopTrivia = function() {
    if (running) {
        triviaChannel.sendMessage("Triva game stopped");
        reset();
    }
}

this.checkAnswer = function(msg) {
    if (msg.content.toLowerCase() === currentAnswer.toLowerCase()) { 
        triviaChannel.sendMessage("Correct!");
        if (addPoint(msg.author) >= correctAnswerThreshold) {
            triviaChannel.sendMessage(msg.author.username + " is the winner!");
            this.stopTrivia();
        } else {
            getQuestionAndPost();
        }
    }
};

this.isRunning = function() {
    return running;
}

this.showScores = function() {
    if (running) {
        let arr = [];
        scores.forEach((value, key, map) => {
            arr.push([key, value]);
        });
        arr.sort((a, b) => {
            return a[1] - b[1];
        });

        let scoreBoard = "**SCOREBOARD**";
        for (let i = 0; i < arr.length; i++) {
            let name = arr[i][0].username;
            let score = arr[i][1];
            scoreBoard += "\n" + name + ": " + score;
        }
        triviaChannel.sendMessage(scoreBoard);
    }
};

function addPoint(author) {
    if (scores.get(author) === undefined) {
        scores.set(author, 1);
        return 1;
    } else {
        let currentScore = scores.get(author);
        scores.set(author, currentScore + 1);
        return currentScore;
    }
}

function getQuestionAndPost() {
    makeApiRequest("http://jservice.io/api/random", response => {
        console.log(response);
        currentQuestion = response[0].question;
        currentAnswer = response[0].answer;
        triviaChannel.sendMessage(currentQuestion);
    });

}

function makeApiRequest(url, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
            callback(JSON.parse(xmlHttp.responseText));
        }
    };
    xmlHttp.open("GET", url, true);
    xmlHttp.setRequestHeader("Api-User-Agent", "Personal/1.0");
    xmlHttp.send(null);
}

function reset() {
    running = false;
    scores = new Map();
    currentAnswer = "";
    currentQuestion = "";
}