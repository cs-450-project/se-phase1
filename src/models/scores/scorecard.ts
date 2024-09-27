/**
 * @file scorecard.ts
 * @description This file contains the implementation of the Scorecard class which holds all of the metric calculations carried out on the module.
 */

/**
 * @class Scorecard
 * @description This class holds all of the metric calculations carried out on the module.
 * It is responsible for calculating the net score and returning results in JSON format.
 * Instances of Scorecard are passed into the different metrics classes as a "request" object.
 */
export class Scorecard {
    url: string;
    owner: string;
    repo: string;
    netScore: number;
    netScore_Latency: number;
    rampUp: number;
    rampUp_Latency: number;
    correctness: number;
    correctness_Latency: number;
    busFactor: number;
    busFactor_Latency: number;
    responsiveMaintainer: number;
    responsiveMaintainer_Latency: number;
    license: number;
    license_Latency: number;
    
    /**
     * @constructor
     * @description Initializes a new instance of the Scorecard class.
     * The constructor takes a URL string and initializes all metric scores to 0.
     * 
     * @param {string} url - The URL of the module
     */
    constructor(url: string) {
        this.url = url;
        this.owner = '';
        this.repo = '';
        this.netScore = 0;
        this.netScore_Latency = 0;
        this.rampUp = 0;
        this.rampUp_Latency = 0;
        this.correctness = 0;
        this.correctness_Latency = 0;
        this.busFactor = 0;
        this.busFactor_Latency = 0;
        this.responsiveMaintainer = 0;
        this.responsiveMaintainer_Latency = 0;
        this.license = 0;
        this.license_Latency = 0;
    }

    /**
     * @method calculateNetScore
     * @description Calculates the net score by averaging the scores of all metrics.
     * The net score is stored in the netScore property.
     * 
     * @returns {void}
     */
    public calculateNetScore(): void {
        this.netScore = (this.rampUp + this.correctness + this.busFactor + this.responsiveMaintainer + this.license) / 5;
    }

    /**
     * @method getResults
     * @description Converts all member variables to a JSON string.
     * The JSON string contains the URL, net score, and individual metric scores along with their latencies.
     * 
     * @returns {string} - The JSON string representation of the scorecard
     */
    public getResults(): string {
        const scores = [
            { 
                URL: this.url,
                NetScore: this.netScore,
                NetScore_Latency: this.netScore_Latency,
                RampUp: this.rampUp,
                RampUp_Latency: this.rampUp_Latency,
                Correctness: this.correctness,
                Correctness_Latency: this.correctness_Latency,
                BusFactor: this.busFactor,
                BusFactor_Latency: this.busFactor_Latency,
                ResponsiveMaintainer: this.responsiveMaintainer,
                ResponsiveMaintainer_Latency: this.responsiveMaintainer_Latency,
                License: this.license,
                License_Latency: this.license_Latency
            }
        ];
        // Convert the array to a JSON string
        return scores.map(score => JSON.stringify(score).replace(/,/g, ', ')).join('\n');
    }
}