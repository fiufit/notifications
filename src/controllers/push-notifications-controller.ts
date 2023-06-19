import { Request, Response } from 'express';
import { GetPushNotificationType, CreatePushNotificationType } from '@controllers/schemas';
import { responseUtils } from '@src/utils';
import { pushNotificationService } from '@src/services';
import { Issue } from '@src/utils/response-utils';
import httpStatus from 'http-status';
import { logger } from '@src/config';

const getNotifications = async (request: Request, response: Response) => {
    const { query } = request as unknown as GetPushNotificationType;

    try {
        const notifications = await pushNotificationService.getNotifications(query);
        const successResponse = responseUtils.createSuccessResponse(notifications);
        response.status(httpStatus.OK).send(successResponse);
    } catch (error: any) {
        const errorResponse = responseUtils.createErrorResponse({
            code: Issue.InternalServerError.code,
            error: error.name,
            message: error.message,
        });
        response.status(httpStatus.INTERNAL_SERVER_ERROR).send(errorResponse);
        logger.error(errorResponse);
    }
}

const createNotification = async (request: Request, response: Response) => {
    const { body } = request as CreatePushNotificationType;

    try {
        const notifications = await pushNotificationService.createNotification(body);
        if (notifications.length === 0) {
            const failResponse = responseUtils.createFailResponse([{
                code: Issue.NotFoundSubscribers.code,
                message: Issue.NotFoundSubscribers.message,
            }]);
            response.status(httpStatus.OK).send(failResponse);
        } else {
            const successResponse = responseUtils.createSuccessResponse(notifications);
            response.status(httpStatus.CREATED).send(successResponse);
        }
    } catch (error: any) {
        const errorResponse = responseUtils.createErrorResponse({
            code: Issue.InternalServerError.code,
            error: error.name,
            message: error.message,
        });
        response.status(httpStatus.INTERNAL_SERVER_ERROR).send(errorResponse);
        logger.error(errorResponse);
    }
};

const pushNotificationController = {
    getNotifications,
    createNotification,
};
  
export { pushNotificationController };
