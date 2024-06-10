import KeyTokenModel from '../models/keytoken.model';
import { ObjectId } from 'mongoose';

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
            console.log(tokens);

            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error('Error creating key token:', error);
            return null;
        }
    }
}

export default KeyTokenService;
