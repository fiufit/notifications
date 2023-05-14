import express from 'express';
import { healthRouter } from '@routers/health-router';

const router = express.Router();
router.use(healthRouter);

export { router };