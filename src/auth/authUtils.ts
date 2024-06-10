import JWT, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { asyncHandler } from '../helpers/asyncHandle';
import { AuthFailureError, NotFoundError } from '../core/error.response';
import KeyTokenService from '../services/keyToken.service';
import { NextFunction, Request, Response } from 'express';
import { IKeyToken} from '../models/keytoken.model';
import { Schema,Types } from 'mongoose';

interface TokenPayload {
    userId: any;
    email: String
}
declare module 'express' {
    interface Request {
        keyStore?: IKeyToken; // Define your custom property here
    }
}
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization'
}
const createTokenPair = async (
    payload: TokenPayload,
    publicKey: string,
    privateKey: string
): Promise<{ accessToken: string; refreshToken: string }> => {
    try {
        const accessTokenOptions: SignOptions = {
            expiresIn: '2 days'
        };

        const refreshTokenOptions: SignOptions = {
            expiresIn: '7 days'
        };

        const accessToken:string = JWT.sign(payload, publicKey, accessTokenOptions);

        const refreshToken:string = JWT.sign(payload, privateKey, refreshTokenOptions);

        JWT.verify(accessToken, publicKey, (err, decode) => {
            if (err) {
                console.error('error verify::', err);
            } else {
                console.log('decode verify::', decode);
            }
        });

        return { accessToken, refreshToken };
    } catch (error) {
        throw error;
    }
};
const authentication = asyncHandler(async(req: Request, res: Response, next: NextFunction) => {
    const userId = req.headers[HEADER.CLIENT_ID] as string
    if (!userId) {
        throw new AuthFailureError('Invalid request')
    }

    const keyStore = await KeyTokenService.findByUserId(userId)
    if (!keyStore) throw new NotFoundError('Not KeyStore')

    const accessToken = req.headers[HEADER.AUTHORIZATION] as string

    if (!accessToken) throw new AuthFailureError('Invalid request')

    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey) as JwtPayload
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
        req.keyStore = keyStore
        return next()
    } catch (error) {
        throw error
    }
})
export { createTokenPair, authentication };
