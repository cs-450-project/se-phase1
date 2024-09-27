/**
 * @file licenseMetric.ts
 * @description This file contains the implementation of the LicenseMetric class which evaluates the license metric of a module.
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @class LicenseMetric
 * @extends Metric
 * @description This class evaluates the license metric of the module. The GitHub API is used to obtain the license information, which is then compared to the approved licenses.
 */
export class LicenseMetric extends Metric {

    private octokit: Octokit;
    
    /**
     * @property {string[]} approvedLicensesIdentifiers - List of approved license identifiers (SPDX IDs)
     */
    private approvedLicensesIdentifiers: string[] = ['MIT', 'LGPL', 'Apache-1.0', 'Apache-1.1'];
    
    /**
     * @property {string[]} approvedLicensesNames - List of approved license names
     */
    private approvedLicensesNames: string[] = ['MIT', 'GNU Lesser General Public License', 'Apache License 1.0', 'Apache License 1.1'];
    
    /**
     * @constructor
     * @description Initializes an instance of the LicenseMetric class and sets up the Octokit instance for GitHub API interactions.
     */
    constructor() {
        super();
        this.octokit = new Octokit({
            auth: process.env.GITHUB_TOKEN
        });
    }

    /**
     * @method evaluate
     * @description Evaluates the license metric of the module by fetching license information from the GitHub repository and checking it against approved licenses.
     * Updates the scorecard with the license score and the latency of the API requests.
     *
     * @param {Scorecard} card - The scorecard object containing module information
     * @returns {Promise<void>} - A promise that resolves when the evaluation is complete
     */
    public async evaluate(card: Scorecard): Promise<void> {
        try {
            let totalLatency = 0;

            // Measure latency for fetching repository information
            const startRepoFetch = Date.now();

            // Fetch the repository information from the GitHub API
            const { data } = await this.octokit.repos.get({
                owner: card.owner, 
                repo: card.repo,   
            });

            const endRepoFetch = Date.now();
            const repoFetchLatency = endRepoFetch - startRepoFetch;
            totalLatency += repoFetchLatency; // Accumulate latency

            // Check if the license is set in the LICENSE file
            if (data.license) {
                if (data.license.spdx_id != null && this.approvedLicensesIdentifiers.includes(data.license.spdx_id)) {
                    card.license = 1;
                } else {
                    card.license = 0;
                }
            } else {
                card.license = 0;
            }

            // Check the README if the license is not set in the LICENSE file
            if (card.license === 0) {
                // Measure latency for fetching the README file
                const startReadmeFetch = Date.now();

                // Get README content
                const readmeData = await this.octokit.repos.getReadme({
                    owner: card.owner,
                    repo: card.repo,
                });

                const endReadmeFetch = Date.now();
                const readmeFetchLatency = endReadmeFetch - startReadmeFetch;
                totalLatency += readmeFetchLatency; // Accumulate latency

                // Decode the content
                const readmeContent = Buffer.from(readmeData.data.content, 'base64').toString('utf-8');
                if (this.checkLicenseInReadme(readmeContent)) {
                    card.license = 1;
                }
            }

            // Set the total latency for license evaluation
            card.license_Latency = totalLatency;
            
        } catch (error) {
            console.error('Error fetching license information:', error);
            card.license = 0;
            card.license_Latency = 0; // Set latency to 0 in case of error
        }
    }

    /**
     * @method checkLicenseInReadme
     * @description Checks if the approved license is mentioned in the README content.
     *
     * @param {string} content - The content of the README file
     * @returns {boolean} - Returns true if an approved license is found in the README content, otherwise false
     */
    private checkLicenseInReadme(content: string): boolean {
        return this.approvedLicensesNames.some(keyword => content.includes(keyword));
    }
}
