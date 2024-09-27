/** 
 * @file metric.ts
 * @description This file contains the definition of the abstract Metric class which serves as a parent class for all metrics.
 */

import { Scorecard } from "../scores/scorecard.js";

/**
 * @abstract
 * @class Metric
 * @description This is the abstract parent class for all metrics. It contains the evaluate() method that will be implemented in the child classes.
 * This allows us to leverage polymorphism, and it follows the Command design pattern.
 */
export abstract class Metric {
    /**
     * @abstract
     * @method evaluate
     * @description Abstract method to evaluate a metric. This method must be implemented in the child classes.
     * 
     * @param {Scorecard} card - The scorecard object containing module information
     * @returns {void}
     */
    public abstract evaluate(card: Scorecard): void;
}