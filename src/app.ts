import express from 'express'
import logger from 'morgan'
import cookieParser from "cookie-parser";
import * as path from "node:path";

// Importing routes
import v1Routes from './v1/routes'

// Configuring express
const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Configuring routes
app.use('/v1/api',v1Routes)

export default app;