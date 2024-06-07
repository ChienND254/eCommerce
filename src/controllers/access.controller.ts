import { Request, Response, NextFunction } from 'express'
import AccessService from '../services/access.service';
import { CREATED } from '../core/success.response';
class AccessController {
    signUp = async (req:Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Registered OK',
            metadata: await AccessService.signUp(req.body) || null,
            options: {
                limits: 10
            }
        }).send(res)
    }
}

export default new AccessController()