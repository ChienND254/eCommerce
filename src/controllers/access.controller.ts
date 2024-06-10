import { Request, Response, NextFunction } from 'express'
import AccessService from '../services/access.service';
import { CREATED, SuccessResponse } from '../core/success.response';

class AccessController {
    login = async (req: Request, res: Response, next: NextFunction) => {        
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    signUp = async (req:Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Registered OK',
            metadata: await AccessService.signUp(req.body) || null,
            options: {
                limits: 10
            }
        }).send(res)
    }
    logout = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.keyStore) {
            return next(new Error('KeyStore not found')); // or handle the error appropriately
        }
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }
}

export default new AccessController()