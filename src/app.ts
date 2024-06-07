import express from 'express';
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
export default app;