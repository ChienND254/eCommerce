import { Request, Response, NextFunction } from 'express'
import findByID from '../services/apiKey.service';
import { IApiKey } from '../models/apikey.model';
import { BadRequestError } from '../core/error.response';
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

interface CustomRequest extends Request {
    objKey?: IApiKey;
}
const apiKey = async (req: CustomRequest, res: Response, next: NextFunction): Promise<void> => {
    const key: string = req.headers[HEADER.API_KEY] as string;
    if (!key) {
        return next(new BadRequestError('Forbidden Error', 403))
    }

    //check object
    const objKey: IApiKey | null = await findByID(key)
    if (!objKey) {
        return next(new BadRequestError('Forbidden Error: Invalid API key', 403))
    }    
    req.objKey = objKey;
    next()
}

const permission = (permission: string) => {
    return (req: CustomRequest, res: Response, next: NextFunction): void => {
        if (!req.objKey?.permissions) {
            return next(new BadRequestError('Permission denied', 403))
        }
        const validPermissions = req.objKey?.permissions.includes(permission)
        if (!validPermissions) {
            return next(new BadRequestError('Permission denied', 403))
        }
        next()
    }
}


export { apiKey, permission};