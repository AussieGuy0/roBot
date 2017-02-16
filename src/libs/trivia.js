var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const utils = require("./utils.js");
const fs = require("fs");
const insideQuestions = JSON.parse(fs.readFileSync("../resources/questions.json")).questions;
let correctAnswerThreshold = 5;
const questionTimeOut = 40;

let timeSinceQuestion = 0;
let timer;

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

this.stopTrivia = function () {
    if (running) {
        triviaChannel.sendMessage("Triva game stopped");
        reset();
    }
}

this.checkAnswer = function (msg) {
    if (msg.channel === triviaChannel && msg.content.toLowerCase() === currentAnswer.toLowerCase()) {
        resetTimer();
        triviaChannel.sendMessage(msg.author.toString() + " is Correct!");
        if (addPoint(msg.author) >= correctAnswerThreshold) {
            triviaChannel.sendMessage(msg.author.username + " is the winner!");
            this.showScores();
            this.stopTrivia();
        } else {
            getQuestionAndPost();
        }
    }
};

this.isRunning = function () {
    return running;
}

this.showScores = function () {
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

let last;

function getQuestionAndPost() {
    if (Math.random() <= 0.5) {
        let rand;
        do {
            rand = Math.floor(Math.random() * insideQuestions.length);
        } while (rand === last);
        postQuestion(insideQuestions[rand]);
        last = rand;
    } else {
        makeApiRequest("http://jservice.io/api/random", postQuestion);
    }
}

function postQuestion(response) {
    console.log(response);
    if (isArray(response)) {
        response = response[0];
    }
    currentQuestion = response.question;
    currentAnswer = response.answer;
    triviaChannel.sendMessage(currentQuestion);
    triviaChannel.sendMessage("HINT: " + showHint());
    timer = setInterval(() => {
        timeSinceQuestion++;
        if (timeSinceQuestion >= questionTimeOut) {
            resetTimer();
            triviaChannel.sendMessage("Time's up!");
            triviaChannel.sendMessage("The correct answer was: " + currentAnswer);
            getQuestionAndPost();
        }
    }, 1000);

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

function showHint() {
    let hintArr = utils.generateArray(currentAnswer.length, "_");
    let numberOfHintChars = Math.floor(currentAnswer.length / 2);
    let randomNumbers = utils.generateUniqueNumbers(0, currentAnswer.length - 1, numberOfHintChars);

    for (let i = 0; i < hintArr.length; i++) {
        if (currentAnswer.charAt(i) === " ") {
            hintArr[i] = " ";
        }
    }

    for (let i = 0; i < randomNumbers.length; i++) {
        let randomNumber = randomNumbers[i];
        hintArr[randomNumber] = currentAnswer.charAt(randomNumber);
    }

    let hint = "`";
    hintArr.forEach((value, index, array) => hint += value + " ");
    hint += "`";
    return hint;
}

function resetTimer() {
    timeSinceQuestion = 0;
    clearInterval(timer);
}


function reset() {
    running = false;
    scores = new Map();
    currentAnswer = "";
    currentQuestion = "";
    resetTimer();
}

function isArray(json) {
    return Object.prototype.toString.call(json) === '[object Array]';
}