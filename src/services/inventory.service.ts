import { ObjectId } from "mongoose";
import { getProductById } from "../models/repositories/product.repo";
import { BadRequestError } from "../core/error.response";
import { InventoryModel } from "../models/inventory.model";

class InventoryService {
    static async addStockToInventory({
        stock,
        productId,
        shopId,
        location = "Hanoi"
    }: { stock: number, productId: ObjectId, shopId: ObjectId, location: string }) {
        const product = await getProductById(productId)
        if (!product) throw new BadRequestError('The product not exist')
        
        const query = {inven_shopId: shopId, inven_productId: productId},
        updateSet = {
            $inc: {
                inven_stock: stock
            },
            $set: {
                inven_location: location
            }
        }, options = {
            upsert: true,
            new: true,
        }

        return await InventoryModel.findOneAndUpdate(query, updateSet, options)
    }

}

export default InventoryService