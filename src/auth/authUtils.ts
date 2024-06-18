import JWT, { JwtPayload, SignOptions } from 'jsonwebtoken';
import { asyncHandler } from '../helpers/asyncHandle';
import { AuthFailureError, NotFoundError } from '../core/error.response';
import KeyTokenService from '../services/keyToken.service';
import { NextFunction, Request, Response } from 'express';
import { IKeyToken} from '../models/keytoken.model';
import { ObjectId } from 'mongoose';

interface TokenPayload {
    userId: ObjectId;
    email: string
}
declare module 'express' {
    interface Request {
        user?: TokenPayload;
        refreshToken?: string;
        keyStore?: IKeyToken;
    }
}
const HEADER = {
    API_KEY: 'x-api-key',
    CLIENT_ID: 'x-client-id',
    AUTHORIZATION: 'authorization',
    REFRESHTOKEN: 'x-rtoken-id'
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
    const refreshToken = req.headers[HEADER.REFRESHTOKEN] as string
    //check header missing user
    if (!userId) throw new AuthFailureError('Invalid request');

    const keyStore = await KeyTokenService.findByUserId(userId)
    // check get AccessToken
    if (!keyStore) throw new NotFoundError('Not KeyStore');
    
    if (refreshToken) {
        try {
            const decodeUser = JWT.verify(refreshToken, keyStore.privateKey) as JwtPayload
            if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
            req.keyStore = keyStore
            req.user = decodeUser as TokenPayload
            req.refreshToken = refreshToken 
            return next()
        } catch (error) {
            throw error
        }
    }
    const accessToken = req.headers[HEADER.AUTHORIZATION] as string
    // check accessToken clien vs db
    if (!accessToken) throw new AuthFailureError('Invalid request')
    
    // ok => next()
    try {
        const decodeUser = JWT.verify(accessToken, keyStore.publicKey) as JwtPayload        
        if (userId !== decodeUser.userId) throw new AuthFailureError('Invalid User')
        req.keyStore = keyStore
        req.user = decodeUser as TokenPayload
        return next()
    } catch (error) {
        throw error
    }
})

// const verifyJWT = async (token:string , keySecret: string) => {
//     return await JWT.verify(token, keySecret)
// }
export { createTokenPair, authentication};
