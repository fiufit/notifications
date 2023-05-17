import { createErrorResponse } from '@src/utils';
import { Request, Response, NextFunction } from 'express';
import { z, ZodError } from 'zod';

const validateRequest = <T extends z.ZodTypeAny>(schema: T) => (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  try {
    const parsedSchema = schema.parse({ 
      body: request.body, 
      query: request.query,
      params: request.params,
    });
    request.body = parsedSchema.body || request.body;
    request.query = parsedSchema.query || request.query;
    request.params = parsedSchema.params || request.params;
    next();
  } catch (error) {
    if (error instanceof ZodError) {
      response.status(400).send(error.issues);
    } else {
      const errorResponse = {
        code: null,
        message: 'Internal server error',
        error: `${error}`,
      };
      response.status(500).send(createErrorResponse(errorResponse));
    }
  }
};

export { validateRequest };
