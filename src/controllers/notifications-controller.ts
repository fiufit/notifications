import { Request, Response } from 'express';

const createNotification = async (_request: Request, response: Response) => {
    response.send('Create notification');
};

const notificationController = {
    createNotification,
};
  
export { notificationController };