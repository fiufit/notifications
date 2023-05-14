import { Request, Response } from 'express';

const health = async (_request: Request, response: Response) => {
    response.send('Server is up');
};

const healthController = {
    health,
};
  
export { healthController };