/**
 * @file index.js
 * @description Entry point of the API. This file creates a simple Express server that listens for requests and processes URLs accordingly.
 */

import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { evaluateModule } from "./models/evaluators/evaluateModule.js";
import { readURLsFromFile } from "./models/evaluators/readURLsFromFile.js";
import dotenv from "dotenv";
dotenv.config();

/**
 * @constant {string} testURL - URL for testing purposes
 */
const testURL = "";

/**
 * @constant {string} testFile - File path for testing purposes
 */
const testFile = "";

/**
 * @constant {Object} argv - Command line arguments parsed by yargs
 * @property {string} url - URL of the module to evaluate
 * @property {string} file - Path to the file containing the URLs
 */
const argv = yargs(hideBin(process.argv))
    .option('url', {
        alias: 'u',
        type: 'string',
        describe: 'URL of the module to evaluate'
    })
    .option('file', {
        alias: 'f',
        type: 'string',
        describe: 'Path to the file containing the URLs'
    })
    .parseSync();

/**
 * @constant {string} url - URL to evaluate, either from command line arguments or testing value
 */
const url = argv.url || testURL;

/**
 * @constant {string} file - File path to read URLs from, either from command line arguments or testing value
 */
const file = argv.file || testFile;

// Call the evaluateModule function with the URL
if (url) {
    const result = evaluateModule(url);
    console.log(result);
}

// Call the readURLsFromFile function with the file path
if (file) {
    readURLsFromFile(file);
}

/*
// Here is the server code for when we want to convert the project to an API
*/
//# sourceMappingURL=index.js.map