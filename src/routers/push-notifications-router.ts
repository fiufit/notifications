import express from 'express';
import { pushNotificationController } from '@src/controllers';
import { validateRequest } from '@src/middlewares';
import { CreatePushNotificationSchema } from '@src/controllers/schemas';

const pushNotificationsRouter = express.Router();

/** 
 * @swagger
 * components:
 *   schemas:
 *     CreatePushNotification:
 *       type: object
 *       properties:
 *         to_user_id:
 *           type: array
 *           items:
 *              type: string
 *           description: User ID to whom the push notification will be sent
 *         title:
 *           type: string
 *           description: Title to display in the notification
 *         subtitle:
 *           type: string
 *           description: Subtitle to display in the notification below the title
 *         body:
 *           type: string
 *           description: The message to display in the notification
 *         sound:
 *           type: string
 *           enum:
 *             - default
 *           description: |
 *             Play a sound when the recipient receives this notification. Specify "default" to play 
 *             the device's default notification sound, or omit this field to play no sound
 *         data:
 *           type: object
 *           properties:
 *             redirect_to: 
 *               type: string
 *               description: Redirect to a part of the application
 *       required:
 *         - to_user_id
 *         - title
 *       example:
 *         to_user_id: [AAFF789K,AAFF7100, KK200SAWQ] 
 *         title: Fiufit
 *         subtitle: Maria has started following you
 *         body: Congrats, you have a new follower!
 *         sound: default
 *         data:
 *           redirect_to: users_profile
 */

/** 
 * @swagger
 * /api/v1/notifications/push:
 *   post:
 *     summary: Create a new push notification
 *     tags:
 *       - CreatePushNotification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             $ref: '#components/schemas/CreatePushNotification'
 *     responses:
 *       200:
 *         description: |
 *           Ok - The request was successful but could not be processed
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#components/schemas/FailResponse'
 *       201:
 *         description: Notification created
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#components/schemas/SuccessResponse'
 *       500:
 *         description: Internal Server Error - An error occurred while processing the request
 *         content: 
 *           application/json:
 *             schema:
 *               type: object
 *               $ref: '#components/schemas/ErrorResponse'
 * 
 */
pushNotificationsRouter.post('/notifications/push', validateRequest(CreatePushNotificationSchema), pushNotificationController.createNotification);

export { pushNotificationsRouter };
