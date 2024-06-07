import {model, Schema, Document} from 'mongoose';

interface IShop extends Document {
    name: string;
    email: string;
    mobile: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    role: string[];
}

const DOCUMENT_NAME:string = 'Shop'
const COLLECTION_NAME: string = 'Shops' 
// Declare the Schema of the Mongo model
var shopSchema = new Schema({
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