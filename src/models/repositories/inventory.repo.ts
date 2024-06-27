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

const reservationInventory = async ({ productId, quantity, cartId }: { productId: ObjectId, quantity: number, cartId: ObjectId }) => {
    const query = {
        inven_productId: productId,
        inven_stock: { $gte: quantity }
    }, updateSet = {
        $inc: {
            inven_stock: -quantity
        },
        $push: {
            inven_reservations: {
                quantity,
                cartId,
                createOn: new Date()
            }
        }
    }, options = { upsert: true, new: true }

    return await InventoryModel.updateOne(query, updateSet, options)
}

export { insertInventory, reservationInventory }