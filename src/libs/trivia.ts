import fetch from 'node-fetch'
import fs from 'fs'
import Discord, { TextChannel, DMChannel, User } from 'discord.js'
import { generateArray, generateUniqueNumbers } from './utils';

// const insideQuestions = JSON.parse(fs.readFileSync("../resources/questions.json")).questions;
const insideQuestions = [];
let correctAnswerThreshold = 5;
const questionTimeOut = 40;

let timeSinceQuestion = 0;
let timer: NodeJS.Timeout;

let triviaChannel: TextChannel | DMChannel;
let currentQuestion = "";
let currentAnswer = "";
let running = false;

let scores = new Map();

export function startTrivia(msg: Discord.Message): void {
    if (!running) {
        running = true;
        triviaChannel = msg.channel;
        triviaChannel.send("Trivia game started");
        getQuestionAndPost();
    } else {
        msg.reply("A trivia game is already in progress!");
    }
};

export function stopTrivia(): void {
    if (running) {
        triviaChannel.send("Triva game stopped");
        reset();
    }
}

export function checkAnswer(msg: Discord.Message): void {
    if (msg.channel === triviaChannel && msg.content.toLowerCase() === currentAnswer.toLowerCase()) {
        resetTimer();
        triviaChannel.send(msg.author.toString() + " is Correct!");
        if (addPoint(msg.author) >= correctAnswerThreshold) {
            triviaChannel.send(msg.author.username + " is the winner!");
            this.showScores();
            this.stopTrivia();
        } else {
            getQuestionAndPost();
        }
    }
};

export function isRunning(): boolean {
    return running;
}

export function showScores(): void {
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
        triviaChannel.send(scoreBoard);
    }
};

function addPoint(author: User) {
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

function getQuestionAndPost(): void {
    if (Math.random() <= 0.1) {
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

function makeApiRequest(url: string, callback: Function): void {
    fetch(url)
        .then(r => r.json())
        .then(callback)
}

function postQuestion(response: any): void {
    console.log(response);
    if (isArray(response)) {
        response = response[0];
    }
    const title = response.category.title;
    currentQuestion = response.question;
    currentAnswer = response.answer;
    triviaChannel.send(`${title}: ${currentQuestion}`);
    triviaChannel.send("HINT: " + showHint());
    timer = setInterval(() => {
        timeSinceQuestion++;
        if (timeSinceQuestion >= questionTimeOut) {
            resetTimer();
            triviaChannel.send("Time's up!");
            triviaChannel.send("The correct answer was: " + currentAnswer);
            getQuestionAndPost();
        }
    }, 1000);

}

function showHint(): string {
    const hintArr = generateArray(currentAnswer.length, "_");
    const numberOfHintChars = Math.floor(currentAnswer.length / 1.5);
    const randomNumbers = generateUniqueNumbers(0, currentAnswer.length - 1, numberOfHintChars);

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

function resetTimer(): void {
    timeSinceQuestion = 0;
    clearInterval(timer);
}

function reset(): void {
    running = false;
    scores = new Map();
    currentAnswer = "";
    currentQuestion = "";
    resetTimer();
}

function isArray(json: any): boolean {
    return Object.prototype.toString.call(json) === '[object Array]';
}