import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan'
import helmet from 'helmet';
import compression from 'compression';
import router from './routes/index'
import {StatusCodes, ReasonPhrases} from '../src/utils/httpStatusCode'
require('dotenv').config()
const app = express();
const logger = morgan('dev')
//inti middleware
app.use(logger);
app.use(helmet())
app.use(compression())
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))
//init db
import('./dbs/init.mongodb')
//init routes
app.use('/', router)

//handle error
app.use((req: Request, res: Response, next: NextFunction) => {
    const error: Error & { status?: number } = new Error(ReasonPhrases.NOT_FOUND);
    error.status = StatusCodes.NOT_FOUND
    next(error)
})
app.use((error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || StatusCodes.INTERNAL_SERVER_ERROR
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || ReasonPhrases.INTERNAL_SERVER_ERROR
    })
})
export default app;