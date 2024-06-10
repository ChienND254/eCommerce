import {model, Schema, Document, Types} from 'mongoose';

interface IKeyToken extends Document {
    user: Types.ObjectId; // Assuming user is a string (maybe the user's ID)
    publicKey: string;
    privateKey: string;
    refreshToken: string;
    refreshTokensUsed: string[];
}

const DOCUMENT_NAME:string = 'Key'
const COLLECTION_NAME: string = 'Keys' 
// Declare the Schema of the Mongo model
const keyTokenSchema:Schema = new Schema({
    user:{
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    },
    publicKey:{
        type:String,
        required:true,
    },
    privateKey:{
        type:String,
        required:true,
    },
    refreshTokensUsed: {
        type: [String],
        default: [],
    },
    refreshToken: {type : String, require: true}
}, {
    timestamps: true,
    collection: COLLECTION_NAME,
});
const KeyTokenModel = model<IKeyToken>(DOCUMENT_NAME, keyTokenSchema);
export default KeyTokenModel;