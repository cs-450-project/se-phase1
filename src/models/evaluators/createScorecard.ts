/**
 * @file createScorecard.ts
 * 
 */

import { Scorecard } from "../scores/scorecard.js";
import { URL } from 'url';

/**
 * @function createScorecard
 * 
 * This function creates a Scorecard object for the module based on the URL passed to it.
 * Here, we add the functionality for supporting npm and GitHub modules.
 * Currently, we're treating them the same, but in the future this is where we'll add the logic that obtains the GitHub repository URL from the npm module URL.
 * 
 * @param {string} url : URL of the module
 * @returns {Scorecard} : Scorecard object for the module
 */
export async function createScorecard(url: string): Promise<Scorecard> {
    // Create URL object from the URL passed to the API
    const urlObject = new URL(url);

    // Check the hostname of the URL to return the correct Screocard object
    if (urlObject.hostname.includes("github.com")) {
        return new Scorecard(url, url);
    } else if (urlObject.hostname.includes("npmjs.com")) {
        const repoUrl = await getNpmRepoURL(url);
        console.log();
        return new Scorecard(url, repoUrl);
    } else {
        throw new Error("Invalid URL");
    }
    
}

async function getNpmRepoURL(url: string): Promise<string> {
    const npmApiUrl = url.replace(/(?<=\/)www(?=\.)/, 'replicate').replace('/package', '')
    const npmApiResponse = await fetch(npmApiUrl);
    const npmApiData = await npmApiResponse.json();
    const npmRepoUrl = npmApiData.repository.url;
    return npmRepoUrl;
}