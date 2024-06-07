import KeyTokenModel from '../models/keytoken.model';
interface CreateKeyTokenParams {
    userId: any;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
}
class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey, refreshToken} :CreateKeyTokenParams): Promise<string | null> => {
        try {
            const filter = {user: userId}, update = {
                publicKey, privateKey, refreshTokensUsed: [], refreshToken
            }, options = {upsert: true, new: true}
            const tokens = await KeyTokenModel.findOneAndUpdate(filter, update, options)
            return tokens
        } catch (error) {
            console.error('Error creating key token:', error);
            return null;
        }
    }
}

export default KeyTokenService;