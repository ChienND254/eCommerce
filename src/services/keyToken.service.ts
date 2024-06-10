import {KeyTokenModel} from '../models/keytoken.model';
import { ObjectId, Types } from 'mongoose';
interface CreateKeyTokenParams {
    userId: ObjectId;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
}

class KeyTokenService {
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: CreateKeyTokenParams): Promise<string | null> => {
        try {

            const filter = { user: userId };
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            };
            
            const options = { upsert: true, new: true };

            const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error('Error creating key token:', error);
            return null;
        }
    }
    
    static findByUserId = async (userId: string) => {
        return await KeyTokenModel.findOne({user: new Types.ObjectId(userId)}, {}).lean()        
    }

    static removeKeyById = async (id: ObjectId) => {
        return await KeyTokenModel.deleteOne(id);
    }
}

export default KeyTokenService;
