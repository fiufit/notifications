import { Request, Response } from 'express';
import { responseUtils } from '@src/utils';
import { CreatePushNotificationType } from '@controllers/schemas';
import { pushNotificationService } from '@src/services';

const createNotification = async (request: Request, response: Response) => {
    const { body } = request as CreatePushNotificationType;
    const notification = await pushNotificationService.createNotification(body);
    const successResponse = responseUtils.createSuccessResponse(notification);
    response.status(201).send(successResponse);
};

const pushNotificationController = {
    createNotification,
};
  
export { pushNotificationController };
