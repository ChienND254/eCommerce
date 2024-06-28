import { NextFunction, Request, Response } from 'express'
import Logger from '../loggers/discord.log'

const pushToLogDiscord = async (req: Request, res: Response, next: NextFunction) => {
    try {
        Logger.sendToFormatCode({
            title: `Method: ${req.method}`,
            code: req.method === 'GET'? req.query : req.body,
            message: `${req.get('host')}${req.originalUrl}}`,
        })

        return next()
    } catch (error) {

    }
}

export { pushToLogDiscord }