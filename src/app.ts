import fs from 'fs'
import Discord from 'discord.js'
import {getRandomLineFromFile} from './libs/fileReader'
import * as trivia from "./libs/trivia.js"
import {UserDatastoreAccessor} from "./libs/UserDatastoreAccessor.js"

const config = JSON.parse(fs.readFileSync("./resources/configuration/config.json").toString());


const commandList = getCommandJSON();
const datastoreAccessor = new UserDatastoreAccessor(config.paths.resources + "/datastore/users.json");

const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user?.username}!`);
});

/**
 * Reads every message and handles commands if message starts with 
 * the prefix key (default '!').
 */
client.on('message', rawMsg => {
    if (rawMsg.partial) {
        // we shouldn't receive partial messages, but check and throw them away just in case
        return
    }
    const msg: Discord.Message = <Discord.Message> rawMsg
    const content = msg.content;
    const msgPrefix = content.charAt(0);
    if (msgPrefix == config.prefix) { 
        const command = content.substr(1, content.length);
        console.log(command)
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
function handleCommand(input: string, msg: Discord.Message): void {
    let selectedCommand = findCommand(input);
    if (selectedCommand !== null) {
        //TODO: Wow, I regret this...
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
function findCommand(commandName: string): any | null {
    console.log(commandName)
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
function handleMelbourneMeme(msg: Discord.Message): void {
    let line = getRandomLineFromFile(config.paths.meme + "/melbourne.txt");
    msg.reply(line);
}

/**
 * Replies to message with a nicely formatted command list.
 */
function showCommandList(msg: Discord.Message): void {
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
    return JSON.parse(fs.readFileSync(jsonFilePath, config.encoding).toString());
}

function startTrivia(msg: Discord.Message): void {
    trivia.startTrivia(msg);
}

function showTriviaScores(msg: Discord.Message): void {
    trivia.showScores();
}

function getPhotoshop(msg: Discord.Message): void {
    const photoShopFolderPath =  config.paths.images + "photoshops/";
    const photoShopFolderFiles = fs.readdirSync(photoShopFolderPath);
    const randomNum = Math.floor(Math.random() * photoShopFolderFiles.length);

    const photoPath = photoShopFolderPath + photoShopFolderFiles[randomNum];

    msg.channel.send(`Here's your photoshop, ${msg.author.toString}!`, {
        files: [{
            attachment: photoPath,
            name: "example.jpg"
        }]
    })
}

function stopTrivia(): void {
    stopTrivia();
}

function showMoney(msg: Discord.Message): void {
    let money = datastoreAccessor.getMoneyOfUser(msg.author.id);
    msg.reply("$" + money);
}

function betRoll(msg: Discord.Message): void {
    let money = datastoreAccessor.getMoneyOfUser(msg.author.id);
    if (money <= 0) {
        msg.reply("Can't betRoll with no money, you goober!");
    } else {
        let rand = Math.floor(Math.random() * 99 + 1);
        msg.reply("Rolled a: " + rand);
    }
}

const apiKey = fs.readFileSync(config.paths.apiKeyFile, config.encoding).toString()
client.login(apiKey);