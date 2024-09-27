/**
 * @file createScorecard.ts
 * @description This file contains the implementation of the createScorecard function which generates a Scorecard object based on the provided URL.
 */

import { Scorecard } from "../scores/scorecard.js";
import { URL } from 'url';
import logger from '../../logger.js';

/**
 * @function createScorecard
 * @description This function creates a Scorecard object for the module based on the URL passed to it.
 * It supports both npm and GitHub modules.
 *
 * @param {string} url - URL of the module
 * @returns {Promise<Scorecard>} - A promise that resolves to a Scorecard object for the module
 * @throws {Error} - Throws an error if the URL is invalid
 */
export async function createScorecard(url: string): Promise<Scorecard> {
    const trimmed = url.trim();
    logger.info(`Creating scorecard for URL: ${trimmed}`);
    
    // Create URL object from the URL passed to the API
    const urlObject = new URL(trimmed);

    // Check the hostname of the URL to pass the correct URLs to the setGitHubAttributes function
    if (urlObject.hostname.includes("github.com")) {
        logger.info(`Detected GitHub URL: ${trimmed}`);
        return setGitHubAttributes(trimmed, trimmed);
    } else if (urlObject.hostname.includes("npmjs.com")) {
        logger.info(`Detected npm URL: ${trimmed}`);
        const repoUrl = await getNpmRepoURL(trimmed);
        return setGitHubAttributes(trimmed, repoUrl);
    } else {
        logger.error(`Invalid URL: ${trimmed}`);
        throw new Error("Invalid URL");
    }
}

/**
 * @function getNpmRepoURL
 * @description Fetches the repository URL from the npm package URL.
 *
 * @param {string} url - URL of the npm package
 * @returns {Promise<string>} - A promise that resolves to the repository URL of the npm package
 * @throws {Error} - Throws an error if the repository URL cannot be fetched
 */
async function getNpmRepoURL(url: string): Promise<string> {
    const npmApiUrl = url.replace(/(?<=\/)www(?=\.)/, 'replicate').replace('/package', '');
    logger.info(`Fetching repository URL from npm API: ${npmApiUrl}`); // Log the API URL
    const npmApiResponse = await fetch(npmApiUrl);
    const npmApiData = await npmApiResponse.json();
    const npmRepoUrl = npmApiData.repository.url;
    logger.info(`NPM Repository URL: ${npmRepoUrl}`); 
    return npmRepoUrl;
}

/**
 * @function setGitHubAttributes
 * @description Sets the GitHub attributes for the Scorecard object.
 *
 * @param {string} url - URL of the module
 * @param {string} urlRepo - GitHub repository URL
 * @returns {Scorecard} - Scorecard object with GitHub set attributes
 */
function setGitHubAttributes(url: string, urlRepo: string): Scorecard {
    const card = new Scorecard(url);
    card.owner = urlRepo.split('/')[3];
    card.repo = urlRepo.split('/')[4];

    if (card.repo.includes('.git')) {
        card.repo = card.repo.replace('.git', '');
    }

    logger.info(`Owner: ${card.owner}`);
    logger.info(`Repo: ${card.repo}`);

    return card;
}