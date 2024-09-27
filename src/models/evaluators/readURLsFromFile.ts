/**
 * @file readURLsFromFile.ts
 * @description This file contains the implementation of the readURLsFromFile function which reads URLs from a file and evaluates each module.
 */

import logger from '../../logger.js';
import * as fs from 'fs';
import { evaluateModule } from './evaluateModule.js';

/**
 * @function readURLsFromFile
 * @description Reads URLs from a file and passes them to the evaluateModule function for evaluation.
 *
 * @param {string} filePath - Path to the file containing URLs
 * @returns {void}
 */
export function readURLsFromFile(filePath: string): void {
    logger.info(`Reading URLs from file: ${filePath}`);
    fs.readFile(filePath, 'utf8', async (err: NodeJS.ErrnoException | null, data: string | null) => {
        if (err) {
            logger.error(`Error reading file: ${err.message}`);
            return;
        }

        if (data === null) {
            logger.error('Error: File data is null.');
            return;
        }

        const urls: string[] = data.split('\n').filter(url => url.trim() !== '');
        logger.info(`Found ${urls.length} URL(s) in the file.`);
        for (const url of urls) {
            try {
                const result: string = await evaluateModule(url);
                logger.flush();
                logger.info(`Results for ${url}: ${result}`);
                console.log(result);
            } catch (error) {
                logger.error(`Error evaluating module at ${url}: ${error}`);
            }
        }
    });
}
