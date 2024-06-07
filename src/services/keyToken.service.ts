import KeyTokenModel from '../models/keytoken.model';
interface CreateKeyTokenParams {
    userId: any;
    publicKey: string;
    privateKey: string;
}
class KeyTokenService {
    static createKeyToken = async ({userId, publicKey, privateKey} :CreateKeyTokenParams): Promise<string | null> => {
        try {
            const tokens = await KeyTokenModel.create({
                userId: userId,
                publicKey,
                privateKey
            })

            return tokens ? tokens.publicKey : null
        } catch (error) {
            console.error('Error creating key token:', error);
            return null;
        }
    }
}

export default KeyTokenService;