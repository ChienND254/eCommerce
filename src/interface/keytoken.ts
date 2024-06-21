import { ObjectId, Document } from "mongoose";

interface IKeyToken extends Document {
    user: ObjectId; // Assuming user is a string (maybe the user's ID)
    publicKey: string;
    privateKey: string;
    refreshToken: string;
    refreshTokensUsed: string[];
}

export { IKeyToken }