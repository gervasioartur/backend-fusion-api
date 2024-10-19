import "express-async-errors"
import logger from 'morgan';
import express from 'express';
import * as path from 'node:path';
import cookieParser from 'cookie-parser';
import swaggerUi from 'swagger-ui-express';

import v1Routes from './v1/routes';
import { errorHandler } from '@/v1/middleware/error-handler';
import { swaggerSpec } from '@/v1/config/swagger-options';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/v1/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use('/v1/api', v1Routes);

app.use(errorHandler);
export default app;
