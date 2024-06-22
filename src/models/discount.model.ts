import { model, Schema } from 'mongoose';
import { IDiscount } from '../interface/discount';

const DOCUMENT_NAME: string = 'Discount';
const COLLECTION_NAME: string = 'discounts';

// Declare the Schema of the Mongo model
const discountSchema: Schema = new Schema({
    discount_name: { type: String, required: true }, // The name of the discount
    discount_description: { type: String, required: true }, // A description of the discount
    discount_type: { type: String, default: 'fixed_amount' }, // The type of discount, e.g., 'fixed_amount' or 'percentage'
    discount_value: { type: Number, required: true }, // The value of the discount
    discount_code: { type: String, required: true }, // The code for the discount
    discount_start_date: { type: Date, required: true }, // The start date of the discount
    discount_end_date: { type: Date, required: true }, // The end date of the discount
    discount_max_uses: { type: Number, required: true }, // The maximum number of times the discount can be used
    discount_uses_count: { type: Number, required: true }, // The number of times the discount has been used
    discount_users_used: { type: Array, default: [] }, // An array of user IDs who have used the discount
    discount_max_uses_per_user: { type: Number, required: true }, // The maximum number of times a single user can use the discount
    discount_min_order_value: { type: Number, required: true }, // The minimum order value required to use the discount
    discount_max_value: { type: Number, required: true }, // The minimum order value required to use the discount
    discount_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' }, // The ID of the shop offering the discount
    discount_is_active: { type: Boolean, default: true }, // Whether the discount is currently active
    discount_applies_to: { type: String, required: true, enum: ['all', 'specific'] }, // Specifies if the discount applies to 'all' products or 'specific' products
    discount_product_ids: { type: Array, default: [] }, // An array of product IDs to which the discount applies
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const discountModel = model<IDiscount>(DOCUMENT_NAME, discountSchema);

export { discountModel };
