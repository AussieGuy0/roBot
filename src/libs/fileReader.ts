const fileMap = new Map<String, Array<String>>();
import fs from 'fs'

/**
 * Reads file into array where each element of array is a single
 * line from the file.
 * 
 * @param fileName The path to the file
 */
export function readFileIntoArray(fileName: string): Array<string> {
    console.log("Reading from file '" + fileName + "'");
    let arr: Array<string> = [];
    let data = fs.readFileSync(fileName, "utf-8");

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
export function getRandomLineFromFile(fileName: string): String {
    let arr: Array<String>
    let cached = fileMap.get(fileName)
    if (cached != undefined) {
        console.log("File '" + fileName + "' has already been read. Reading data from cache.")
        arr = cached
    } else {
        arr = readFileIntoArray(fileName);
        fileMap.set(fileName, arr);
    }
    var rand = Math.floor(Math.random() * arr.length);
    return arr[rand];
};
