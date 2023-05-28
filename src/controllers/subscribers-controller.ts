import { Request, Response } from 'express';
import { CreateSubscriberType } from '@controllers/schemas';
import { subscriberService } from '@src/services';
import { responseUtils } from '@src/utils';
import { logger } from '@src/config';
import { Issue } from '@src/utils/response-utils';
import httpStatus from 'http-status';

const createSubscriber = async (request: Request, response: Response) => {
    const { body } = request as CreateSubscriberType;
    
    try {
        const subscriber = await subscriberService.createSubscriber(body);
        const successResponse = responseUtils.createSuccessResponse(subscriber);
        response.status(httpStatus.CREATED).send(successResponse);
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

const subscriberController = {
    createSubscriber,
};
  
export { subscriberController };
