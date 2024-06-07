import { Request, Response, NextFunction } from 'express'
import AccessService from '../services/access.service';
class AccessController {
    signUp = async (req:any, res: Response, next: NextFunction) => {
        try {
            return res.status(201).json(await AccessService.signUp(req.body))
        } catch (error) {
            next(error)
        }
    }
}

export default new AccessController()