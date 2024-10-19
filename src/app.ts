import "express-async-errors"
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import * as path from 'node:path';

import v1Routes from './v1/routes';
import { errorHandler } from '@/v1/middleware/error-handler';

const app = express();
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/v1/api', v1Routes);
app.use(errorHandler);
export default app;
