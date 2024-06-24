import { Document } from "mongoose";
import { IProduct } from "./product";

interface ICart extends Document {
    cart_state: 'active' | 'completed' | 'failed' | 'pending';
    cart_products: Partial<IProduct>[];
    cart_count_product: number;
    cart_userId: number;
}

export { ICart }