import { ObjectId, Document } from "mongoose";

interface IShop extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    role: string[];
}

export {IShop}