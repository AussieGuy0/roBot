const fs = require('fs');
const fileMap = new Map();

/**
 * Reads file into array where each element of array is a single
 * line from the file.
 * 
 * @param fileName The path to the file
 */
this.readFileIntoArray = function(fileName) {
    console.log("Reading from file '" + fileName + "'");
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
    console.log(arr);
    return arr;
};


/**
 * Reads a file and returns a random line from it.
 * 
 * @param fileName path to file
 */
this.getRandomLineFromFile = function(fileName) {
    let arr;
    if (fileMap.get(fileName) === undefined) {
        arr = this.readFileIntoArray(fileName);
        fileMap.set(fileName, arr);
    } else {
        console.log("File '" + fileName + "' has already been read. Reading data from cache.");
        arr = fileMap.get(fileName);
    }
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
};
