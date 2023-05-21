import { Request, Response } from 'express';
import { CreatePushNotificationType } from '@controllers/schemas';
import { responseUtils } from '@src/utils';
import { pushNotificationService } from '@src/services';
import { Issue } from '@src/utils/response-utils';

const createNotification = async (request: Request, response: Response) => {
    const { body } = request as CreatePushNotificationType;
    const notifications = await pushNotificationService.createNotification(body);

    if (notifications.length === 0) {
        const failResponse = responseUtils.createFailResponse([{
            code: Issue.NotFoundSubscribers.code,
            message: Issue.NotFoundSubscribers.message,
        }]);
        response.status(401).send(failResponse);
    } else {
        const successResponse = responseUtils.createSuccessResponse(notifications);
        response.status(201).send(successResponse);
    }
};

const pushNotificationController = {
    createNotification,
};
  
export { pushNotificationController };
