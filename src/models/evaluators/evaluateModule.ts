/**
 * @file evaluateModule.ts
 * 
 * This is the main driving file for evaluating a module.
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { createScorecard } from './createScorecard.js';
import { Metric } from '../metrics/metric.js';
import { LicenseMetric } from '../metrics/licenseMetric.js';
import * as fs from 'fs';


/**
 * @constant {Metric[]} metrics : Array of metrics to be evaluated
 * 
 * All objects that derive from the the Metric abstract parent class are added to this array.
 * We're utilizing polymorphism. The evaluate() method is implemented in each child class. 
 * So if we iterate through the array and call evaluate() on each object, we'll get the results of each metric.
 * 
 */ 
const metrics: Metric[] = []

// Add Metric objects to the array
metrics.push(new LicenseMetric());

/**
 * @function evaluateModule
 * 
 * This is the main driving function for evaluating modules.
 * It creates a Scorecard object for the module and then passes it to each object in the array for evaluation.
 * The results are then returned in JSON format, and will be passed to the front end.
 * 
 * @param {string} url : URL of the module
 * @returns {Promise<string>} : JSON string of the results
 * 
 */
export async function evaluateModule(url: string): Promise<string> {
    // Call the createScorecard function
    const scorecard: Scorecard = await createScorecard(url);

    //console.log("Scorecard created.");
    //console.log(scorecard.getResults());

    return scorecard.getResults();
}
