/**
 * @file urlServices.ts
 * @description This file contains the implementation of the URLServices class which is used to start the scoring process for a module.
 */

import { evaluateModule } from "../../models/evaluators/evaluateModule.js";

/**
 * @class URLServices
 * @description This class is used to start the scoring process for the module. It calls the evaluateModule() function.
 */
class URLServices {

    /**
     * @method beginScoringModule
     * @description Starts the scoring process for the module by calling the evaluateModule function.
     * 
     * @param {string} url - The URL of the module to be evaluated
     * @returns {Promise<string>} - A promise that resolves to the result of the evaluation
     */
    public static async beginScoringModule(url: string): Promise<string> {
        // Call the evaluateModule function and pass the URL
        const result = await evaluateModule(url);
        
        // [TESTING] Print the results to the console
        console.log(result);

        return result;
    }

}

export default URLServices;