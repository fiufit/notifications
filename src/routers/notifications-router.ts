import express from 'express';
import { notificationController } from '@src/controllers';

const notificationsRouter = express.Router();
notificationsRouter.get('/notifications', notificationController.createNotification); // POST

export { notificationsRouter };
