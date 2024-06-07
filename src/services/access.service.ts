import {ShopModel, IShop} from '../models/shop.model';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import KeyTokenService from './keyToken.service';
import { createTokenPair } from '../auth/authUtils';
import getInfoData from '../utils';

const RoleShop = {
    SHOP: 'SHOP',
    WRITER: 'WRITER',
    EDITOR: 'EDITOR',
    ADMIN: 'ADMIN'
};


interface ServiceResponse {
    code: string;
    message?: string;
    status?: string;
    metadata?: {
        shop: Pick<IShop, '_id' | 'name' | 'email'>; 
        tokens: {
            accessToken: string;
            refreshToken: string;
        };
    } | null;
}

class AccessService {
    static signUp = async ({ name, email, password }: { name: string, email: string, password: string }): Promise<ServiceResponse> => {
        try {
            const holderShop = await ShopModel.findOne({ email }).lean();
            if (holderShop) {
                return {
                    code: 'xxxx',
                    message: 'Shop already registered'
                };
            }
            const passwordHash: string = await bcrypt.hash(password, 10);
            const newShop = await ShopModel.create({
                name,
                email,
                password: passwordHash,
                roles: [RoleShop.SHOP]
            });

            if (newShop) {
                // const { publicKey, privateKey }: { publicKey: string, privateKey: string } = crypto.generateKeyPairSync('rsa', {
                //     modulusLength: 4096,
                //     publicKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     },
                //     privateKeyEncoding: {
                //         type: 'pkcs1',
                //         format: 'pem'
                //     }
                // });
                const privateKey:string = crypto.randomBytes(64).toString('hex')
                const publicKey:string = crypto.randomBytes(64).toString('hex')

                const keyStore = await KeyTokenService.createKeyToken({
                    userId: newShop._id,
                    publicKey,
                    privateKey
                })

                if (!keyStore) {
                    return {
                        code: 'xxx',
                        message: 'publicKeyString error'
                    }
                }
                const tokens = await createTokenPair({ userId: newShop._id, email }, publicKey, privateKey)

                return {
                    code: '201',
                    metadata: {
                        shop: getInfoData({fields: ['_id', 'name', 'email'], object: newShop}),
                        tokens
                    }
                }
            }
            return {
                code: '200',
                metadata: null
            }
        } catch (error: any) {
            return {
                code: 'xxx',
                message: error.message,
                status: 'error'
            };
        }
    }
}

export default AccessService;
