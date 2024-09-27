/**
 * @file urlController.ts
 * @description This file contains the implementation of the URLController class which handles the process-url endpoint.
 */

import { Request, Response } from 'express';
import { URL } from 'url';
import URLServices from '../services/urlServices.js';

/**
 * @class URLController
 * @description This class is the controller for the process-url endpoint. It contains the processURL() method that will be called when the endpoint is hit with the appropriate HTTP request (POST). That method will then call the beginScoringModule() method from the URLServices class.
 */
class URLController {
       
    /**
     * @method processURL
     * @description Handles the POST request to the process-url endpoint. Validates the URL format and calls the beginScoringModule() method from the URLServices class.
     * 
     * @param {Request} req - The HTTP request object
     * @param {Response} res - The HTTP response object
     * @returns {Promise<void>} - A promise that resolves when the processing is complete
     */
    public static async processURL(req: Request, res: Response): Promise<void> {
        
        // Get the URL from the request body
        const { url } = req.body;

        // Validate the URL format
        try {
            const urlObject = new URL(url);
            const response = await URLServices.beginScoringModule(url);
            res.send(response);

        } catch (error) {
            res.status(400).send("Invalid URL");
        }
    }
}

export default URLController;