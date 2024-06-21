import { Document, ObjectId } from "mongoose";

interface IInventory extends Document {
    inven_product: ObjectId;
    inven_location: string;
    inven_stock: number;
    inven_shopId: ObjectId;
    inven_reservations: any[];
}

export { IInventory }