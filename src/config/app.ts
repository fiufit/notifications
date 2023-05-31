import express from 'express';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUiExpress from 'swagger-ui-express';
import path from 'path';
import { router } from '@src/routers';
import { env } from '@config/env';
import cors from 'cors';

// App configuration
const app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', router);

// Swagger config
const swaggerSpec = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Microservicio - Notificaciones API',
            version: '1.0.0',
        },
        servers: [
            {
                url: `http://${env.host}:${env.port}`,
            }
        ],
        components: {
            schemas: {
                SuccessResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            value: 'success',
                        },
                        data: {
                            type: 'object'
                        },
                    },
                    required: ['status', 'data'],
                },
                FailResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            value: 'fail',
                        },
                        data: {
                            type: 'object',
                            properties: {
                                code: {
                                    type: 'string',
                                    description: 'Unique code that identifies the failure'
                                },
                                message: {
                                    type: 'string',
                                    description: 'Cause of the failure'
                                },
                                path: {
                                    type: 'string',
                                    description: 'Path to the field that is causing the failure'
                                }
                            },
                            required: ['code', 'message'],
                        },
                    },
                    required: ['status', 'data'],
                },
                ErrorResponse: {
                    type: 'object',
                    properties: {
                        status: {
                            type: 'string',
                            value: 'error',
                        },
                        data: {
                            type: 'object',
                            properties: {
                                code: {
                                    type: 'string',
                                    description: 'Unique code that identifies the failure'
                                },
                                error: {
                                    type: 'string',
                                    description: 'Name of the error'
                                },
                                message: {
                                    type: 'string',
                                    description: 'Cause of the error'
                                },
                            },
                            required: ['code', 'error', 'message']
                        },
                    },
                    required: ['status', 'data'],
                }
            }
        }
    },
    apis: [`${path.join(__dirname, '../routers/*.ts')}`],
    schemes: ['http'],
}
const swaggerDoc = swaggerJsDoc(swaggerSpec);
app.use('/api/v1/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDoc));

export { app };
