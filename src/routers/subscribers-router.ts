import express from 'express';
import { subscriberController } from '@src/controllers';
import { CreateSubscriberSchema } from '@src/controllers/schemas';
import { validateRequest } from '@src/middlewares';

const subscribersRouter = express.Router();
subscribersRouter.post('/subscribers', validateRequest(CreateSubscriberSchema), subscriberController.createSubscriber);

export { subscribersRouter };
