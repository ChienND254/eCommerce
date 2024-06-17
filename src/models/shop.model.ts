import {model, Schema, Document, ObjectId} from 'mongoose';

interface IShop extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    role: string[];
}

const DOCUMENT_NAME:string = 'Shop'
const COLLECTION_NAME: string = 'Shops' 
// Declare the Schema of the Mongo model
const shopSchema:Schema = new Schema({
    name:{
        type:String,
        trim: true,
        maxLength: 150
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'inactive'
    },

    verify: {
        type: Schema.Types.Boolean,
        default: false
    },
    role: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});
const ShopModel = model<IShop>(DOCUMENT_NAME, shopSchema);
export {ShopModel, IShop};