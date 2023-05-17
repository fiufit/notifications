import { createSuccessResponse } from '@src/utils';
import { Request, Response } from 'express';

const createSubscriber = async (request: Request, response: Response) => {
    const successResponse = createSuccessResponse({
        body: request.body,
    });
    response.status(201).send(successResponse);
};

const subscriberController = {
    createSubscriber,
};
  
export { subscriberController };
