import { model, Schema } from 'mongoose';
import { IInventory } from '../interfaces';

const DOCUMENT_NAME: string = 'Order'
const COLLECTION_NAME: string = 'Orders'

// Declare the Schema of the Mongo model
const orderSchema: Schema = new Schema({
    order_userId: { type: Number, require: true },
    order_checkout: { type: Object, default: {} },
    order_shipping: { type: Object, default: {} },
    order_payment: { type: Object, default: {} },
    order_products: { type: Array, default: true },
    order_trackingBNumber: { type: String, default: '#0000011123123' },
    order_status: { type: String, enum: ['pending', 'confirmed', 'shipped', 'cancelled', 'delivered'], default: 'pending' }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const OrderModel = model<IInventory>(DOCUMENT_NAME, orderSchema);

export { OrderModel };