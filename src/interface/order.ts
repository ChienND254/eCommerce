import { Document } from 'mongoose';
import { ObjectId } from 'mongoose';

export interface IOrder extends Document {
    _id?: ObjectId;
    order_userId: number;
    order_checkout: {
        [key: string]: any;
    };
    order_shipping: {
        [key: string]: any;
    };
    order_payment: {
        [key: string]: any;
    };
    order_products: any[];
    order_trackingBNumber: string;
    order_status: 'pending' | 'confirmed' | 'shipped' | 'cancelled' | 'delivered';
    createdAt?: Date;
    updatedAt?: Date;
}