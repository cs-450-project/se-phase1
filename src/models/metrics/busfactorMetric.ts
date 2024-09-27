/**
 * @file busFactorMetric.ts
 * @description This file contains the implementation of the BusFactorMetric class which evaluates the bus factor of a repository.
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @class BusFactorMetric
 * @extends Metric
 * @description Evaluates the bus factor of the repository by analyzing the distribution of contributions among contributors.
 * Also calculates and logs the latency of the GitHub API request.
 */
export class BusFactorMetric extends Metric {

    private octokit!: Octokit;

    /**
     * @constructor
     * @description Initializes the Octokit instance for GitHub API interactions.
     */
    constructor() {
        super();
        try {
            this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
        } catch (error) {
            console.error('Error initializing Octokit:', error);
        }
    }

    /**
     * @method evaluate
     * @description Evaluates the bus factor of the repository by fetching contributors data from the GitHub API.
     * Updates the scorecard with the bus factor score and the latency of the API request.
     *
     * @param {Scorecard & { BusFactor_Latency?: number }} card - The scorecard object containing module information
     * @returns {Promise<void>} - A promise that resolves when the evaluation is complete
     */
    public async evaluate(card: Scorecard & { BusFactor_Latency?: number }): Promise<void> {
        try {
            // Measure start time
            const startTime = Date.now();

            // Fetch contributors data from GitHub API
            const contributorsData = await this.octokit.repos.listContributors({
                owner: card.owner,
                repo: card.repo,
                per_page: 100,
            });

            // Measure end time
            const endTime = Date.now();

            // Calculate latency in milliseconds
            card.busFactor_Latency = endTime - startTime;
            //console.log(`API Latency: ${card.busFactor_Latency} ms`); 

            const contributors = contributorsData.data;

            if (contributors.length === 0) {
                card.busFactor = 0;
                return;
            }

            const totalContributions = contributors.reduce((sum, contributor) => sum + contributor.contributions, 0);

            const topContributions = contributors[0].contributions;

            const topContributorPercentage = topContributions / totalContributions;

            // Scoring logic based on top contributor's percentage
            if (topContributorPercentage >= 0.8) {
                card.busFactor = 0;
            } else if (topContributorPercentage >= 0.6) {
                card.busFactor = 0.2;
            } else if (topContributorPercentage >= 0.4) {
                card.busFactor = 0.5;
            } else {
                card.busFactor = 1;
            }

        } catch (error) {
            console.error('Error fetching contributors information:', error);
            card.busFactor = 0;
        }
    }
}
