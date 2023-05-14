import express from 'express';
import { healthController } from '@src/controllers';

const healthRouter = express.Router();
healthRouter.get('/health', healthController.health);

export { healthRouter };