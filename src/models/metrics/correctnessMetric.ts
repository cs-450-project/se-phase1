/**
 * @file correctnessMetric.ts
 * @description This file contains the implementation of the CorrectnessMetric class which evaluates the correctness of a repository.
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';
dotenv.config();

/**
 * @class CorrectnessMetric
 * @extends Metric
 * @description Evaluates the correctness of the repository by checking for test suites and analyzing bug reports.
 * Also calculates the latency of API requests to GitHub.
 */
export class CorrectnessMetric extends Metric {

    private octokit: Octokit;

    /**
     * @constructor
     * @description Initializes the Octokit instance for GitHub API interactions.
     */
    constructor() {
        super();
        this.octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });
    }

    /**
     * @method evaluate
     * @description Evaluates the correctness of the repository by checking for test suites and analyzing bug reports.
     * Updates the scorecard with the correctness score.
     *
     * @param {Scorecard} card - The scorecard object containing module information
     * @returns {Promise<void>} - A promise that resolves when the evaluation is complete
     */
    public async evaluate(card: Scorecard): Promise<void> {
        try {
            let correctnessScore = 0;

            // Check for test suite in package.json
            const hasTests = await this.checkForTests(card);
            correctnessScore += hasTests ? 0.5 : 0;

            // Analyze bug reports
            const bugScore = await this.analyzeBugs(card);
            correctnessScore += bugScore;

            // Ensure score is between 0 and 1
            card.correctness = Math.min(correctnessScore, 1);

        } catch (error) {
            console.error('Error evaluating correctness metric:', error);
            card.correctness = 0;
        }
    }

    /**
     * @method checkForTests
     * @description Checks if the repository has a test suite by looking for a test script in package.json.
     * Updates the scorecard with the latency of the API request.
     *
     * @param {Scorecard} card - The scorecard object containing module information
     * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the repository has a test suite
     */
    private async checkForTests(card: Scorecard): Promise<boolean> {
        try {
            // Measure start time
            const startTime = Date.now();

            // Fetch package.json content
            const packageJsonData = await this.octokit.repos.getContent({
                owner: card.owner,
                repo: card.repo,
                path: 'package.json',
            });

            // Measure end time
            const endTime = Date.now();
            card.correctness_Latency = endTime - startTime;
            //console.log(`checkForTests API Latency: ${latency} ms`); 

            const packageJsonContent = Buffer.from((packageJsonData.data as any).content, 'base64').toString('utf-8');
            const packageJson = JSON.parse(packageJsonContent);

            return !!(packageJson.scripts && packageJson.scripts.test);

        } catch (error: any) {
            if (error.status === 404) {
                console.warn('package.json not found in the repository.');
                // Return false if package.json is not found
                return false; 
            } else {
                console.error('Error checking for tests:', error);
                // Return false for other errors as well
                return false; 
            }
        }
    }

    /**
     * @method analyzeBugs
     * @description Analyzes the bug reports in the repository by fetching issues labeled as 'bug' from GitHub.
     * Updates the scorecard with the latency of the API request.
     *
     * @param {Scorecard} card - The scorecard object containing module information
     * @returns {Promise<number>} - A promise that resolves to a number representing the bug score
     */
    private async analyzeBugs(card: Scorecard): Promise<number> {
        try {
            // Measure start time
            const startTime = Date.now();

            // Fetch issues data from GitHub
            const issuesData = await this.octokit.issues.listForRepo({
                owner: card.owner,
                repo: card.repo,
                labels: 'bug',
                state: 'all',
                per_page: 100,
            });

            // Measure end time
            const endTime = Date.now();
            card.correctness_Latency = endTime - startTime;
            //console.log(`analyzeBugs API Latency: ${latency} ms`); 

            const issues = issuesData.data;
            const openBugs = issues.filter(issue => issue.state === 'open').length;
            const closedBugs = issues.filter(issue => issue.state === 'closed').length;

            const totalBugs = openBugs + closedBugs;
            if (totalBugs === 0) {
                return 0.5; // Neutral score if no bugs reported
            }

            const openBugRatio = openBugs / totalBugs;
            if (openBugRatio >= 0.5) {
                return 0; // Low score if many bugs are open
            } else if (openBugRatio >= 0.3) {
                return 0.1;
            } else if (openBugRatio >= 0.1) {
                return 0.3;
            } else {
                return 0.5;
            }

        } catch (error) {
            console.error('Error analyzing bugs:', error);
            return 0; // Low score if unable to fetch issues
        }
    }
}
