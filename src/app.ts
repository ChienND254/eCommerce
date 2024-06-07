import express, { Request, Response, NextFunction } from 'express';
import morgan from 'morgan'
import helmet from 'helmet';
import compression from 'compression';
import router from './routes/index'
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
    const error: Error & { status?: number } = new Error('Not found');
    error.status = 404
    next(error)
})
app.use((error: Error & { status?: number }, req: Request, res: Response, next: NextFunction) => {
    const statusCode = error.status || 500
    return res.status(statusCode).json({
        status: 'error',
        code: statusCode,
        message: error.message || "Internal Server Error"
    })
})
export default app;