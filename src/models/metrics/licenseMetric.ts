/**
 * @file licenseMetric.ts
 * 
 */

import { Scorecard } from '../scores/scorecard.js';
import { Metric } from './metric.js';

/**
 * @class LicenseMetric
 * 
 * This class will evaluate the license metric of the module.
 * The GitHub API will be used to obtain the license information.
 * It will be compared to the approved license.
 * 
 */
export class LicenseMetric extends Metric {

    
    public evaluate(card: Scorecard): void {
        throw new Error('Method not implemented.');
    }
}