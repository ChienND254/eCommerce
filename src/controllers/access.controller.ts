import { Request, Response, NextFunction } from 'express'
import AccessService from '../services/access.service';
import { CREATED, SuccessResponse } from '../core/success.response';
import { AuthFailureError } from '../core/error.response';

class AccessController {
    /**
     * @desc Handle user login
     * @param {string} email
     * @param {string} password
     * @return {JSON} 
     */
    login = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            metadata: await AccessService.login(req.body)
        }).send(res)
    }
    /**
     * @desc Handle user sign-up
     * @param {string} name
     * @param {string} email
     * @param {string} password
     * @return {JSON} 
     */
    signUp = async (req: Request, res: Response, next: NextFunction) => {
        new CREATED({
            message: 'Registered OK',
            metadata: await AccessService.signUp(req.body) || null,
            options: {
                limits: 10
            }
        }).send(res)
    }

    /**
     * @desc Handle user logout
     * @return {JSON} 
     */
    logout = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.keyStore) {
            return next(new Error('KeyStore not found')); // or handle the error appropriately
        }
        new SuccessResponse({
            message: 'Logout Success',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }

    /**
     * @desc Handle refresh token 
     * @param {string} refreshToken
     * @returns  {JSON}
     */
    handleRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        if (!req.refreshToken || !req.user || !req.keyStore) {
            return next(new AuthFailureError('Invalid request'));
        }
        new SuccessResponse({
            message: 'Get Token Access',
            metadata: await AccessService.handlerRefreshToken({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }
}

export default new AccessController()