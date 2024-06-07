import { Request, Response, NextFunction } from 'express'
import findByID from '../services/apiKey.service';
import { IApiKey } from '../models/apikey.model';
const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization'
}

interface CustomRequest extends Request {
    objKey?: IApiKey;
}
const apiKey = async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
        const key:string = req.headers[HEADER.API_KEY] as string;
        if (!key) {
            return res.status(403).json({
                message: 'Forbidden Error'
            })
        }

        //check object
        const objKey:IApiKey | null = await findByID(key)
        if (!objKey) {
            return res.status(403).json({
                message: 'Forbidden Error: Invalid API key'
            });
        }
        req.objKey = objKey;
        return next()
    } catch (error) {
        console.error('Error in API key middleware:', error);
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
}

const permission = (permission:string) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        if (!req.objKey?.permissions) {
            return res.status(500).json({
                message: 'Permission denied'
            });
        }
        const validPermissions = req.objKey?.permissions.includes(permission)
        if (!validPermissions) {
            return res.status(500).json({
                message: 'Permission denied'
            });
        }
        return next()
    }
}

const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        fn(req, res, next).catch(next)
    }
}
export {apiKey, permission, asyncHandler};