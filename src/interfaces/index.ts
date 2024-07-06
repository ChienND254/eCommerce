import { Document, ObjectId } from "mongoose";
import { NotificationType } from "../utils/notificationTypes";

export interface IApiKey extends Document {
    key: string;
    status: boolean;
    permissions: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IShop extends Document {
    _id: ObjectId;
    name: string;
    email: string;
    password: string;
    status: 'active' | 'inactive';
    verify: boolean;
    role: string[];
}

export interface IProduct extends Document {
    productId: ObjectId;
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_slug?: string;
    product_price: number;
    product_quantity: number;
    product_type: string;
    product_shop: ObjectId;
    product_attributes: any;
    product_ratingsAverage?: number;
    product_variations?: any[];
    isDraft?: boolean;
    isPublished?: boolean;
}

export interface IElectronics extends Document {
    manufacturer: string;
    deviceModel: string;
    color: string;
    product_shop: ObjectId;
}
export interface IClothing extends Document {
    brand: string;
    size: string;
    material: string;
    product_shop: ObjectId;
}

export interface IFurniture extends Document {
    brand: string;
    size: string;
    material: string;
    product_shop: ObjectId;
}

export interface ICart extends Document {
    cart_state: 'active' | 'completed' | 'failed' | 'pending';
    cart_products: Partial<IProduct>[];
    cart_count_product: number;
    cart_userId: number;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IComment extends Document {
    comment_productId: ObjectId;
    comment_userId: number;
    comment_content: string;
    comment_left: number;
    comment_right: number;
    comment_parentId: ObjectId | null;
    isDeleted: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IDiscount extends Document {
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
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IInventory extends Document {
    inven_product: ObjectId;
    inven_location: string;
    inven_stock: number;
    inven_shopId: ObjectId;
    inven_reservations: any[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IKeyToken extends Document {
    user: ObjectId;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
    refreshTokensUsed: string[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface INotification extends Document {
    noti_type: NotificationType;
    noti_senderId: number;
    noti_receivedId: number;
    noti_content: string;
    noti_options: Record<string, any>;
    createdAt?: Date;
    updatedAt?: Date;
}

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