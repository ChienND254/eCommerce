import { model, Schema } from 'mongoose';
import { IClothing, IElectronics, IProduct, IFurniture } from '../interface/product';
import slugify from 'slugify';

const DOCUMENT_NAME: string = 'Product';
const COLLECTION_NAME: string = 'Products';

const productSchema: Schema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_slug: String,
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true, },
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing', 'Furniture'] }, // Single type string
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_attributes: { type: Schema.Types.Mixed, required: true },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [1, 'Rating must be above 1.0'],
        max: [5, 'Rating must be above 5.0'],
        set: (val: number) => Math.round(val * 10) / 10
    },
    product_variations: { type: Array, default: [] },
    isDraft: { type: Boolean, default: true, index: true, select: false },
    isPublished: { type: Boolean, default: false, index: true, select: false }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

productSchema.index({product_name: 'text', product_description: 'text'})
//document middleware: run before .save and .create ...
productSchema.pre<IProduct>('save', function(next) {
    this.product_slug = slugify(this.product_name, {lower: true})
    next();
})

const clothingSchema: Schema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Clothes',
    timestamps: true,
})

const electronicsSchema: Schema = new Schema({
    manufacturer: { type: String, require: true },
    deviceModel: String,
    color: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Electronics',
    timestamps: true,
})

const furnitureSchema: Schema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
}, {
    collection: 'Furnitures',
    timestamps: true,
})

const productModel = model<IProduct>(DOCUMENT_NAME, productSchema);
const electronicsModel = model<IElectronics>('Electronics', electronicsSchema);
const clothingModel = model<IClothing>('Clothing', clothingSchema);
const furnitureModel = model<IFurniture>('Furnitures', furnitureSchema);

export { productModel, electronicsModel, clothingModel, furnitureModel };
