import "express-async-errors"
import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import * as path from 'node:path';

import v1RoutesMock from './routes-mock';
import { errorHandler } from '@/v1/middleware/error-handler';

const appMock = express();
appMock.use(logger('dev'));
appMock.use(express.json());
appMock.use(express.urlencoded({ extended: false }));
appMock.use(cookieParser());
appMock.use(express.static(path.join(__dirname, 'public')));
appMock.use('/v1/api', v1RoutesMock);
appMock.use(errorHandler);
export default appMock;