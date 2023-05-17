import { Request, Response } from 'express';

const createSubscriber = async (request: Request, response: Response) => {
    response.send({
        status: 'success',
        data: {
            body: request.body,
        }
    });
};

const subscriberController = {
    createSubscriber,
};
  
export { subscriberController };
