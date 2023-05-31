import express from 'express';
import { subscriberController } from '@src/controllers';
import { CreateSubscriberSchema } from '@src/controllers/schemas';
import { validateRequest } from '@src/middlewares';

const subscribersRouter = express.Router();

/** 
 * @swagger
 * components:
 *   schemas:
 *     CreateSubscriber:
 *       type: object
 *       properties:
 *         user_id: 
 *           type: string
 *           description: User ID of the new subscriber
 *         device_token:
 *           type: string
 *           description: Device Expo Token that identifies the user device
 *       required:
 *         - user_id
 *         - device_token
 *       example:
 *         user_id: AAFF789K
 *         device_token: ExponentPushToken[m5qIwWEA9E-LtduZOV4U9h]
 */

/** 
 * @swagger
 * /api/v1/subscribers:
 *   post:
 *     summary: Create a new subscriber
 *     tags:
 *       - CreateSubscriber
 *     requestBody:
 *       required: true
 *       content: 
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#components/schemas/CreateSubscriber'
 *     responses:
 *       201:
 *         description: Subscriber created
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#components/schemas/SuccessResponse'
 *       500:
 *         description: Internal Server Error - An error occurred while processing the request.
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#components/schemas/ErrorResponse'
 * 
 */
subscribersRouter.post('/subscribers', validateRequest(CreateSubscriberSchema), subscriberController.createSubscriber);

export { subscribersRouter };
