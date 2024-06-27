import { Document, ObjectId } from "mongoose";

interface IDiscount extends Document {
    discount_name: string;
    discount_description: string;
    discount_type: string;
    discount_value: number;
    discount_code: string;
    discount_start_date: Date;
    discount_end_date: Date;
    discount_max_uses: number;
    discount_uses_count: number;
    discount_users_used: number[];
    discount_max_uses_per_user: number;
    discount_min_order_value: number;
    discount_max_value: number;
    discount_shopId: ObjectId;
    discount_is_active: boolean;
    discount_applies_to: string;
    discount_product_ids: ObjectId[];
}

export { IDiscount }