import express from 'express';
import { pushNotificationController } from '@src/controllers';
import { validateRequest } from '@src/middlewares';
import { CreatePushNotificationSchema } from '@src/controllers/schemas';

const pusNotificationsRouter = express.Router();
pusNotificationsRouter.post('/notifications/push', validateRequest(CreatePushNotificationSchema), pushNotificationController.createNotification);

export { pusNotificationsRouter };
