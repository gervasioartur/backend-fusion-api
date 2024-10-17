import express from 'express'
import logger from 'morgan'
import cookieParser from "cookie-parser";
import * as path from "node:path";

// Importing routes
import indexRouter from './routes/index'

// Configuring express
const app = express()
app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// Configuring routes
app.use('/', indexRouter)

export default app;