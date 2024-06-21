import { model, Schema } from 'mongoose';
import { IInventory } from '../interface/inventory';

const DOCUMENT_NAME: string = 'Inventory'
const COLLECTION_NAME: string = 'Inventories'

// Declare the Schema of the Mongo model
const inventorySchema: Schema = new Schema({
    inven_product: { type: Schema.Types.ObjectId, ref: 'Product' },
    inven_location: { type: String, default: 'unknown' },
    inven_stock: { type: Number, require: true },
    inven_shopId: { tupe: Schema.Types.ObjectId, ref: 'Shop' },
    inven_reservations: { type: Array, default: [] }
}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

const InventoryModel = model<IInventory>(DOCUMENT_NAME, inventorySchema);

export { InventoryModel };