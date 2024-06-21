import { ObjectId, Document } from "mongoose";

interface IProduct extends Document {
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

interface IElectronics extends Document {
    manufacturer: string;
    deviceModel: string;
    color: string;
    product_shop: ObjectId;
}
interface IClothing extends Document {
    brand: string;
    size: string;
    material: string;
    product_shop: ObjectId;
}

interface IFurniture extends Document {
    brand: string;
    size: string;
    material: string;
    product_shop: ObjectId;
}

export { IProduct, IElectronics, IClothing, IFurniture }