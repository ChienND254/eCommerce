import { model, Schema} from 'mongoose';
import { IClothing, IElectronics, IProduct, IFurniture } from '../interface/product';

const DOCUMENT_NAME: string = 'Product';
const COLLECTION_NAME: string = 'Products';

const productSchema: Schema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true},
    product_quantity: { type: Number, required: true,},
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] }, // Single type string
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'},
    product_attributes: {type: Schema.Types.Mixed,required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const clothingSchema:Schema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    collection: 'Clothes',
    timestamps: true,
})

const electronicsSchema:Schema = new Schema({
    manufacturer: { type: String, require: true },
    deviceModel: String,
    color: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    collection: 'Electronics',
    timestamps: true,
})

const furnitureSchema:Schema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}
}, {
    collection: 'Furnitures',
    timestamps: true,
})
const productModel = model<IProduct>(DOCUMENT_NAME, productSchema);
const electronicsModel = model<IElectronics>('Electronics', electronicsSchema);
const clothingModel = model<IClothing>('Clothing', clothingSchema);
const furnitureModel = model<IFurniture>('Furnitures', furnitureSchema);

export { productModel, electronicsModel, clothingModel, furnitureModel};
