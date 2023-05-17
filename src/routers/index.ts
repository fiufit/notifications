import express from 'express';
import { subscribersRouter } from '@routers/subscribers-router';
import { notificationsRouter } from '@routers/notifications-router';

const router = express.Router();
router.use([ subscribersRouter, notificationsRouter ]);

export { router };
