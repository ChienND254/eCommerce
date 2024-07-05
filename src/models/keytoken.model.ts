import { model, Schema } from 'mongoose';
import { IKeyToken } from '../interfaces';

const DOCUMENT_NAME: string = 'Key'
const COLLECTION_NAME: string = 'Keys'

// Declare the Schema of the Mongo model
const keyTokenSchema: Schema = new Schema({
    user: { type: Schema.Types.ObjectId, required: true, ref: 'Shop' },
    publicKey: { type: String, required: true, },
    privateKey: { type: String, required: true, },
    refreshTokensUsed: { type: [String], default: [], },
    refreshToken: { type: String, require: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});

const keyTokenModel = model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);

export { keyTokenModel };