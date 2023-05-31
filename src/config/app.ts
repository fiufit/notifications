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
    },
    apis: [`${path.join(__dirname, '../routers/*.ts')}`],
    schemes: ['http'],

}
const swaggerDoc = swaggerJsDoc(swaggerSpec);
app.use('/api/v1/docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerDoc));

export { app };
