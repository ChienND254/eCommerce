import { keyTokenModel } from '../models/keytoken.model';
import { ObjectId, Types } from 'mongoose';
import { IKeyToken } from '../interface/keytoken';

interface CreateKeyTokenParams {
    userId: ObjectId;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
}

class KeyTokenService {
    // Method to create or update a key token
    static createKeyToken = async ({ userId, publicKey, privateKey, refreshToken }: CreateKeyTokenParams): Promise<string | null> => {
        try {
            // Define the filter to find the key token by user ID
            const filter = { user: userId };

            // Define the update object with new values
            const update = {
                publicKey,
                privateKey,
                refreshTokensUsed: [],
                refreshToken
            };

            // Define options for findOneAndUpdate operation
            const options = { upsert: true, new: true };

            // Find and update the key token
            const tokens = await keyTokenModel.findOneAndUpdate(filter, update, options);

            // Return the publicKey if tokens exist, otherwise null
            return tokens ? tokens.publicKey : null;
        } catch (error) {
            console.error('Error creating key token:', error);
            return null;
        }
    }

    // Method to find a key token by user ID
    static findByUserId = async (userId: string): Promise<IKeyToken | null> => {
        return await keyTokenModel.findOne({ user: new Types.ObjectId(userId) }).lean();
    }

    // Method to remove a key token by ID
    static removeKeyById = async (id: ObjectId): Promise<any> => {
        return await keyTokenModel.deleteOne({ _id: id });
    }

    // Method to find a key token by refresh token used
    static findByRefreshTokenUsed = async (refreshToken: string): Promise<IKeyToken | null> => {
        return await keyTokenModel.findOne({ refreshTokensUsed: refreshToken }).lean();
    }

    // Method to find a key token by refresh token
    static findByRefreshToken = async (refreshToken: string): Promise<any> => {
        return await keyTokenModel.findOne({ refreshToken: refreshToken });
    }

    // Method to update refresh token
    static updateRefreshToken = async (newRefreshToken: string, usedRefreshToken: string): Promise<IKeyToken | null> => {
        const updateQuery: any = {
            $set: { refreshToken: newRefreshToken }
        };

        // Add to set only if usedRefreshToken is not empty
        if (usedRefreshToken !== '') {
            updateQuery.$addToSet = { refreshTokensUsed: usedRefreshToken };
        }

        return await keyTokenModel.findOneAndUpdate(
            { refreshToken: usedRefreshToken },
            updateQuery,
            { new: true }
        ).lean();
    }
    
    // Method to delete a key token by user ID
    static deleteKeyById = async (userId: ObjectId): Promise<any> => {
        return await keyTokenModel.deleteOne({ user: userId });
    }
}

export default KeyTokenService;
