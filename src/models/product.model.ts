import { model, Schema, Document, ObjectId } from 'mongoose';

interface IProduct extends Document {
    product_name: string;
    product_thumb: string;
    product_description?: string;
    product_price: number;
    product_quantity: number;
    product_type: string;
    product_shop: ObjectId;
    product_attributes: any;
}

const DOCUMENT_NAME: string = 'Product';
const COLLECTION_NAME: string = 'Products';

// Declare the Schema of the Mongo model
const productSchema: Schema = new Schema({
    product_name: { type: String, required: true },
    product_thumb: { type: String, required: true },
    product_description: String,
    product_price: { type: Number, required: true},
    product_quantity: { type: Number, required: true,},
    product_type: { type: String, required: true, enum: ['Electronics', 'Clothing'] }, // Single type string
    product_shop: {type: Schema.Types.ObjectId, ref: 'Shop'}, // This could be a reference or identifier to the shop
    product_attributes: {type: Schema.Types.Mixed,required: true }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const clothingSchema = new Schema({
    brand: { type: String, require: true },
    size: String,
    material: String,
}, {
    collection: 'Clothes',
    timestamps: true,
})

const electronicsSchema = new Schema({
    manufacturer: { type: String, require: true },
    size: String,
    material: String,
}, {
    collection: 'Electronics',
    timestamps: true,
})
const ProductModel = model<IProduct>(DOCUMENT_NAME, productSchema);
ProductModel.discriminator('Clothing', clothingSchema);
ProductModel.discriminator('Electronics', electronicsSchema);
export { ProductModel, IProduct };
