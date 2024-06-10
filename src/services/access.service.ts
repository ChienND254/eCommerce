import { ShopModel, IShop } from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import getInfoData from '../utils';
import { AuthFailureError, BadRequestError } from '../core/error.response';
import { findByEmail } from './shop.service';
import { ObjectId} from 'mongoose';
import { IKeyToken } from '../models/keytoken.model';

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};

interface ServiceResponse {
    shop: Pick<IShop, '_id' | 'name' | 'email'>;
    tokens: {
        accessToken: string;
        refreshToken: string;
    };
}

class AccessService {
    static logout = async(keyStore:IKeyToken) => {
        const delKey = await KeyTokenService.removeKeyById(keyStore._id as ObjectId)
        return delKey
    }
    static login = async ({ email, password, refreshToken = null }: { email: string, password: string, refreshToken: string | null }): Promise<ServiceResponse> => {
        
        const foundShop: IShop | null = await findByEmail({ email });
        
        if (!foundShop) throw new BadRequestError('Shop not registered');

        const match = await bcrypt.compare(password, foundShop.password);
        if (!match) throw new AuthFailureError('Authentication error');

        const privateKey: string = crypto.randomBytes(64).toString('hex');
        const publicKey: string = crypto.randomBytes(64).toString('hex');

        const tokens = await createTokenPair({ userId: foundShop._id, email }, publicKey, privateKey);

        await KeyTokenService.createKeyToken({
            userId: foundShop._id as ObjectId, // Ensure userId is ObjectId
            refreshToken: tokens.refreshToken,
            privateKey: privateKey,
            publicKey: publicKey
        });

        return {
            shop: getInfoData({ fields: ['_id', 'name', 'email'], object: foundShop }),
            tokens
        };
    }

    static signUp = async ({ name, email, password }: { name: string, email: string, password: string }): Promise<ServiceResponse | null> => {
        if (!name || !email || !password) {
            throw new BadRequestError('Name, email, and password are required fields');
        }

        const holderShop = await ShopModel.findOne({ email }).lean();
        if (holderShop) throw new BadRequestError('Error: Shop already registered');

        const passwordHash: string = await bcrypt.hash(password, 10);
        const newShop = await ShopModel.create({
            name,
            email,
            password: passwordHash,
            roles: [RoleShop.SHOP]
        });

        if (newShop) {
            const privateKey: string = crypto.randomBytes(64).toString('hex');
            const publicKey: string = crypto.randomBytes(64).toString('hex');

            const keyStore = await KeyTokenService.createKeyToken({
                userId: newShop._id as ObjectId, // Ensure userId is ObjectId
                publicKey,
                privateKey,
                refreshToken: ''
            });
            
            if (!keyStore) {
                throw new BadRequestError('KeyStore Error', 403);
            }

            const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey);

            return {
                shop: getInfoData({ fields: ['_id', 'name', 'email'], object: newShop }),
                tokens
            };
        }
        return null;
    }
}

export default AccessService;
