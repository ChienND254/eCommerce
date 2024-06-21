import { model, Schema } from 'mongoose';
import { IApiKey } from '../interface/apikey';

const DOCUMENT_NAME: string = 'ApiKey'
const COLLECTION_NAME: string = 'ApiKeys'

// Declare the Schema of the Mongo model
const apiTokenSchema: Schema = new Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true,
    },
    permissions: {
        type: [String],
        required: true,
        enum: ['0000', '1111', '2222']
    },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const ApiKeyModel = model<IApiKey>(DOCUMENT_NAME, apiTokenSchema);

export { ApiKeyModel };