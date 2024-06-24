import { model, Schema } from 'mongoose';
import { ICart } from '../interface/cart';

const DOCUMENT_NAME: string = 'Cart';
const COLLECTION_NAME: string = 'Carts';

const cartSchema: Schema = new Schema({
    cart_state: { type: String, required: true, enum: ['active', 'completed', 'failed', 'pending'], default: 'active' },
    cart_products: { type: Array, required: true, default: [] },
    cart_count_product: { type: Number, default: 0 },
    cart_userId: { type: Number, required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const cartModel = model<ICart>(DOCUMENT_NAME, cartSchema)

export { cartModel };