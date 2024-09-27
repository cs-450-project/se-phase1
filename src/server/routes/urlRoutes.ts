/**
 * @file urlRoutes.ts
 * @description Defines the routes for the process-url endpoint.
 */

import { Router } from 'express';
import URLController from '../controllers/urlController.js';

const router = Router();

/**
 * @route POST /
 * @description Route to process the URL. Calls the processURL method from the URLController.
 */
router.post('/', URLController.processURL);

export default router;