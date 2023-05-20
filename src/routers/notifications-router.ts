import express from 'express';
import { pushNotificationController } from '@src/controllers';
import { validateRequest } from '@src/middlewares';
import { CreatePushNotificationSchema } from '@src/controllers/schemas';

const notificationsRouter = express.Router();
notificationsRouter.post('/notifications/push', validateRequest(CreatePushNotificationSchema), pushNotificationController.createNotification);

export { notificationsRouter };
