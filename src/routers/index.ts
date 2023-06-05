import express from 'express';
import { subscribersRouter } from '@routers/subscribers-router';
import { pushNotificationsRouter } from '@routers/push-notifications-router';

const router = express.Router();
router.use([ subscribersRouter, pushNotificationsRouter ]);

export { router };
