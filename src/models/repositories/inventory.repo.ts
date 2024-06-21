import { ObjectId } from "mongoose"
import { InventoryModel } from "../inventory.model"
import { IInventory } from "../../interface/inventory"

const insertInventory = async ({ productId, shopId, stock, location = 'unknown' }:
    { productId: ObjectId, shopId: ObjectId, stock: number, location?: string }
): Promise<IInventory> => {
    return await InventoryModel.create({
        inven_productId: productId,
        inven_shopId: shopId,
        inven_stock: stock,
        inven_location: location
    })
}

export { insertInventory, }