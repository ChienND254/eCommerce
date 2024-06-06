import express, { Request, Response, Handler } from 'express';
import morgan from 'morgan'
import helmet from 'helmet';
import compression from 'compression';
require('dotenv').config()
const app = express();
const logger = morgan('dev')
//inti middleware
app.use(logger);
app.use(helmet())
app.use(compression())

//init db
import('./dbs/init.mongodb')
//init routes
app.get('/', (req: Request, res: Response) => {
    const str = 'Hello sasdsadsadsadsa'
    return res.status(200).json({
        message: 'done',
        metadata: str.repeat(100000)
    })
})

//handle error
export default app;