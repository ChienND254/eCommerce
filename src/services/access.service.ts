import { shopModel} from '../models/shop.model';
import { IKeyToken, IShop } from '../interfaces';
import bcrypt from 'bcrypt';
import crypto from 'node:crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import {getInfoData} from '../utils';
import { AuthFailureError, BadRequestError, ForbiddenError } from '../core/error.response';
import { findByEmail } from './shop.service';
import { ObjectId } from 'mongoose';
import { RoleShop } from '../utils/roleShop';

interface ServiceResponse {
    shop: Pick<IShop, '_id' | 'name' | 'email'>;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}
interface HandlerRefreshTokenParams {
    refreshToken: string;
    user: {
        userId: any;
        email: string
    };
    keyStore: IKeyToken;
}
class AccessService {
    static logout = async (keyStore: IKeyToken) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id as ObjectId)
        return delKey
    }

    static login = async ({ email, password, refreshToken = null }: { email: string, password: string, refreshToken: string | null }): Promise<ServiceResponse> => {

        // Finding shop by email
        const foundShop: IShop | null = await findByEmail({ email });

        // If shop not found, throw BadRequestError
        if (!foundShop) throw new BadRequestError('Shop not registered');

        // Comparing password using bcrypt
        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication error');

        // Generating new public and private keys
        const privateKey: string = crypto.randomBytes(64).toString('hex');
        const publicKey: string = crypto.randomBytes(64).toString('hex');

        // Creating token pair for authentication
        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);

        // Creating key token for refresh token management
        await KeyTokenService.createKeyToken({
            userId: foundShop._id as ObjectId, // Ensure userId is ObjectId
            refreshToken: tokens.refreshToken,
            privateKey: privateKey,
            publicKey: publicKey
        });

        // Returning response with shop information and tokens
        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        };
    }

    // Static method for user signup
    static signUp = async ({ name, email, password }: { name: string, email: string, password: string }): Promise<ServiceResponse | null> => {

        // Validation for required fields
        if (!name || !email || !password) {
            throw new BadRequestError('Name, email, and password are required fields');
        }

        // Checking if shop with email already exists
        const holderShop = await shopModel.findOne({ email }).lean();
        if (holderShop) throw new BadRequestError('Error: Shop already registered');

        // Hashing password using bcrypt
        const passwordHash: string = await bcrypt.hash(password, 10);

        // Creating new shop record
        const newShop = await shopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        });

        // If new shop created successfully
        if (newShop) {
            // Generating new public and private keys
            const privateKey: string = crypto.randomBytes(64).toString('hex');
            const publicKey: string = crypto.randomBytes(64).toString('hex');

            // Creating key token for new shop
            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id as ObjectId, // Ensure userId is ObjectId
                publicKey,
                privateKey,
                refreshToken: ''
            });

            // Handling key token creation errors
            if (!keyStore) {
                throw new BadRequestError('KeyStore Error', 403);
            }

            // Creating token pair for authentication
            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);
            await KeyTokenService.updateRefreshToken(tokens.refreshToken, '');
            // Returning response with shop information and tokens
            return {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            };
        }
        return null;
    }

    /*
        check refresh token used?
    */
    static handlerRefreshToken = async ({ refreshToken, user, keyStore }: HandlerRefreshTokenParams) => {

        if (keyStore.refreshTokensUsed.includes(refreshToken)) {
            // delete all token trong KeyStore

            await KeyTokenService.deleteKeyById(user.userId)
            throw new ForbiddenError('Something wrong happend!! Pls relogin')
        }

        if (keyStore.refreshToken !== refreshToken) throw new AuthFailureError('Shop not register 1');

        const fouldShop = await findByEmail({ email: user.email })
        if (!fouldShop) throw new AuthFailureError('Shop not register 2');

        //create new refreshUser
        const tokens = await createTokenPair({ userId: user.userId, email: user.email }, keyStore.publicKey, keyStore.privateKey);

        await KeyTokenService.updateRefreshToken(tokens.refreshToken, refreshToken);
        return {
            user,
            tokens
        }
    }
}

export default AccessService;
