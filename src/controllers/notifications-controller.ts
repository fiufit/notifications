import { responseUtils } from '@src/utils';
import { Request, Response } from 'express';

const createNotification = async (request: Request, response: Response) => {
    const successResponse = responseUtils.createSuccessResponse({
        body: request.body,
    });
    response.status(201).send(successResponse);
};

const notificationController = {
    createNotification,
};
  
export { notificationController };