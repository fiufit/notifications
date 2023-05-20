import express from 'express';
import { subscribersRouter } from '@routers/subscribers-router';
import { pusNotificationsRouter } from '@routers/push-notifications-router';

const router = express.Router();
router.use([ subscribersRouter, pusNotificationsRouter ]);

export { router };
