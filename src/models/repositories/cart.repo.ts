import { ICart } from "../../interface/cart";
import { IProduct } from "../../interface/product";
import { cartModel } from "../cart.model";

const createUserCart = async ({ userId, product }: { userId: number, product: Partial<IProduct> }): Promise<ICart | null> => {
    const query = { cart_userId: userId, cart_state: 'active' },
        updateOrInsert = {
            $addToSet: {
                cart_products: product
            },
        }, options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateOrInsert, options)
}

const updateUserCartQuantity = async ({ userId, product }: { userId: number, product: Partial<IProduct> }): Promise<ICart | null> => {
    const { productId, product_quantity } = product
    const query = { cart_userId: userId, 'cart_products.productId': productId, cart_state: 'active' },
        updateSet = {
            $inc: {
                'cart_products.$.product_quantity': product_quantity
            },
        }, options = { upsert: true, new: true }

    return await cartModel.findOneAndUpdate(query, updateSet, options)
}

export { createUserCart, updateUserCartQuantity }