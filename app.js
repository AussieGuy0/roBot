const Discord = require("discord.js");
const client = new Discord.Client();
const fs = require('fs');

const resourcesFolder = "resources/";
const apiKeyFile = resourcesFolder + "credentials/apiKey.txt";

const fileMap = new Map();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
    let content = msg.content;
    if (content.charAt(0) == "!") {
        let command = content.substr(1);
        if (command === "melbournememe") {
            let line = getRandomLineFromFile(resourcesFolder + "meme/melbourne.txt");
            msg.reply(line);
        }
    }
});

function getRandomLineFromFile(fileName) {
    let arr;
    if (fileMap.get(fileName) === undefined) {
        console.log("Reading from file");
        arr = readFileIntoArray(fileName);
        fileMap.set(fileName, arr);
    } else {
        console.log("Reading from map");
        arr = fileMap.get(fileName);
    }
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
}


function readFileIntoArray(fileName) {
    let arr = [];
    let data = fs.readFileSync(fileName, "utf-8");

    let pointer = 0;
    let dataString = data;
    while (dataString.indexOf('\n') >= 0) {
        let index = dataString.indexOf("\n");
        let toPush = dataString.substr(0, index);
        arr.push(toPush);
        dataString = dataString.substr(index + 1);
    }
    return arr;
}

function isNullOrUndefined(value) {
    return value === null || value === undefined;
}

client.login(fs.readFileSync(apiKeyFile, "utf-8"));