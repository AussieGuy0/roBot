const fs = require('fs');
const Discord = require("discord.js");
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.username}!`);
});

client.on('message', msg => {
    let content = msg.content;
    if (content.charAt(0) == "!") {
        let command = content.substr(1);
        if (command === "melbournememe") {
            let arr = readFileIntoArray("resources/meme/melbourne.txt");
            var rand = Math.floor(Math.random() * arr.length);
            msg.reply(arr[rand]);
        }
    }
});


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

client.login('MjM5NzE1ODY3MDQxMDcxMTA1.C3dbsw.9N4Y4nDA6hcrzirCyzIj6xCXNF8');
readFileIntoArray("resources/meme/melbourne.txt");
