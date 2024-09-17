/**
 * @function readUrlsFromFile
 * 
 * Reads URLs from a file and passes them to evaluateModule function
 * 
 * @param {string} filePath : Path to the file containing URLs
 */
import * as fs from 'fs';
import {evaluateModule} from './evaluateModule.js';

export function readUrlsFromFile(filePath: string): void {
    fs.readFile(filePath, 'utf8', async (err: NodeJS.ErrnoException | null, data: string | null) => {
        if (err) {
            console.error(`Error reading file: ${err.message}`);
            return;
        }

        if (data === null) {
            console.error('Error: File data is null.');
            return;
        }

        const urls: string[] = data.split('\n').filter(url => url.trim() !== '');

        for (const url of urls) {
            try {
                const result: string = await evaluateModule(url);
                //console.log(`Results for ${url}:`);
                console.log(result);
                //console.log(''); // Adding an extra blank line for better readability
            } catch (error) {
                console.error(`Error evaluating module at ${url}: ${error}`);
            }
        }
    });
}