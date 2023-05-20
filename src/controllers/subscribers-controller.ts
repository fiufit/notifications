import { Request, Response } from 'express';
import { CreateSubscriberType } from '@controllers/schemas';
import { subscriberService } from '@src/services';
import { responseUtils } from '@src/utils';

const createSubscriber = async (request: Request, response: Response) => {
    const { body } = request as CreateSubscriberType;
    const subscriber = await subscriberService.createSubscriber(body);
    const successResponse = responseUtils.createSuccessResponse(subscriber);
    response.status(201).send(successResponse);
};

const subscriberController = {
    createSubscriber,
};
  
export { subscriberController };
