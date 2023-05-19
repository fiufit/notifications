import express from 'express';
import { notificationController } from '@src/controllers';
import { validateRequest } from '@src/middlewares';
import { CreateNotificationSchema } from '@src/controllers/schemas';

const notificationsRouter = express.Router();
notificationsRouter.post('/notifications/push', validateRequest(CreateNotificationSchema), notificationController.createNotification);

export { notificationsRouter };
