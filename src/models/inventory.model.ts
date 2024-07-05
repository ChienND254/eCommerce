import { model, Schema } from 'mongoose';
import { IInventory } from '../interfaces';

const DOCUMENT_NAME: string = 'Inventory'
const COLLECTION_NAME: string = 'Inventories'

// Declare the Schema of the Mongo model
const inventorySchema: Schema = new Schema({
    inven_productId: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_shopId: { type: Schema.Types.ObjectId, ref: 'Shop' },
    inven_stock: { type: Number, require: true },
    inven_reservations: { type: Array, default: [] },
    inven_location: { type: String, default: 'unknown' },
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const InventoryModel = model<IInventory>(DOCUMENT_NAME, inventorySchema);

export { InventoryModel };