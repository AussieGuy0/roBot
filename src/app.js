const fs = require('fs');
const config = JSON.parse(fs.readFileSync("../resources/configuration/config.json"));

const Discord = require("discord.js");
const client = new Discord.Client();
const fileReader = require(config.paths.libs + "fileReader.js");
const trivia = require(config.paths.libs + "trivia.js");
const UserDatastoreAccessor = require(config.paths.libs + "UserDatastoreAccessor.js")

const commandList = getCommandJSON();
const datastoreAccessor = new UserDatastoreAccessor(config.paths.resources + "/datastore/users.json");

client.on('ready', () => {
    client.user.setAvatar(config.paths.images + "avatars/2.png");
    console.log(`Logged in as ${client.user.username}!`);
    // console.log("CHANNELS")
    // client.channels.get("229173797184471040").sendMessage("++voice");
    // console.log("USERS");
    // console.log(client.users);
});

/**
 * Reads every message and handles commands if message starts with 
 * the prefix key (default '!').
 */
client.on('message', msg => {
    let content = msg.content;
    let msgPrefix = content.charAt(0);
    if (msgPrefix == config.prefix) { 
        let command = content.substr(1);
        handleCommand(command, msg);
    } else if (trivia.isRunning()) {
        trivia.checkAnswer(msg);
    }
});

/**
 * Runs the associated function of a user inputted command. If inputted command
 * does not exist in bot, replies with a helpful message.
 * 
 * @param input The command the user specified
 * @param msg The message object where the user inserted the command
 */
function handleCommand(input, msg) {
    let selectedCommand = findCommand(input);
    if (selectedCommand !== null) {
        eval(selectedCommand.function + "(msg)"); //runs function 
    } else {
        msg.reply("Command not found. Type '!help' to see full command list");
    }
}


/**
 * Returns the command object assocatied with the given command name.
 * If no command object found then returns null.
 * 
 * @param commandName The name of the command to find 
 */
function findCommand(commandName) {
    for (let i = 0; i < commandList.commands.length; i++) {
        let currentCommand = commandList.commands[i];
        if (currentCommand.command === commandName) {
            return currentCommand;
        }
    }
    return null;
}

/**
 * Replies to message with a random line from melbourne meme text file.
 */
function handleMelbourneMeme(msg) {
    let line = fileReader.getRandomLineFromFile(config.paths.meme + "/melbourne.txt");
    msg.reply(line);
}

/**
 * Replies to message with a nicely formatted command list.
 */
function showCommandList(msg) {
    msg.reply(createCommandList());
}

/**
 * Returns a nicely formatted list showing the commands of the bot.
 */
function createCommandList() {
    let out = "Commands:";
    for (let i = 0; i < commandList.commands.length; i++) {
        let currentCommand = commandList.commands[i];
        let commandString = "\n **!" + currentCommand.command + "** - " + currentCommand.description;
        out += commandString;
    }
    return out;
}

/**
 * Returns a JSON object with all the commands avaliable to the bot.
 */
function getCommandJSON() {
    let jsonFilePath = config.paths.commandList; 
    return JSON.parse(fs.readFileSync(jsonFilePath, config.encoding));
}

function startTrivia(msg) {
    trivia.startTrivia(msg);
}

function showTriviaScores(msg) {
    trivia.showScores();
}

function getPhotoshop(msg) {
    let photoShopFolderPath =  config.paths.images + "photoshops/";
    let photoShopFolderFiles = fs.readdirSync(photoShopFolderPath);
    let randomNum = Math.floor(Math.random() * photoShopFolderFiles.length);

    let photoPath = photoShopFolderPath + photoShopFolderFiles[randomNum];


    msg.channel.sendFile(photoPath, "", "Here's your photoshop, " + msg.author.toString() + "!");
}

function stopTrivia() {
    trivia.stopTrivia();
}



function showMoney(msg) {
    let money = datastoreAccessor.getMoneyOfUser(msg.author.id);
    msg.reply("$" + money);
}

client.login(fs.readFileSync(config.paths.apiKeyFile, config.encoding));