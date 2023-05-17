import express from 'express';
import { router } from '@src/routers';

// App configuration
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use('/api/v1', router);

export { app };
