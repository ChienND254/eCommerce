import { cartModel } from "../models/cart.model";
import { createUserCart, updateUserCartQuantity } from "../models/repositories/cart.repo";
import { getProductById } from "../models/repositories/product.repo";
import { NotFoundError } from "../core/error.response";
import { ObjectId } from "mongoose";
import { ICart, IProduct } from "../interfaces";

class CartService {

    static async addToCart({ userId, product }: { userId: number, product: Partial<IProduct> }): Promise<ICart | null> {
        const userCart = await cartModel.findOne({ cart_userId: userId })
        
        if (!userCart) {
            return await createUserCart({ userId, product })
        }
        
        const existingProductIndex = userCart.cart_products.findIndex(p => p.productId === product.productId);
        if (existingProductIndex === -1) {
            userCart.cart_products.push(product);
            return await userCart.save()
        }

        return await updateUserCartQuantity({ userId, product })
    }

    static async updateToCart({ userId, shop_order_ids }: { userId: number, shop_order_ids: any }) {
        const { productId, quantity, old_quantity } = shop_order_ids[0]?.item_products[0]

        const foundProduct: IProduct | null = await getProductById(productId)
        if (!foundProduct) throw new NotFoundError('')

        if (foundProduct.product_shop.toString() !== shop_order_ids[0]?.shopId) {
            throw new NotFoundError('Product do not belong to the shop')
        }

        if (quantity === 0) {

        }

        return await updateUserCartQuantity({
            userId, product: {
                productId,
                product_quantity: quantity - old_quantity
            }
        })
    }

    static async deleteUserCart({ userId, productId }: { userId: number, productId: ObjectId }) {
        const query = { cart_userId: userId, cart_state: 'active' },
            updateSet = {
                $pull: {
                    cart_products: {
                        productId
                    }
                }
            }

        const deleteCart = await cartModel.updateOne(query, updateSet)

        return deleteCart
    }

    static async getListUserCart({userId}:{userId: number}) {
        return await cartModel.findOne({
            cart_userId: +userId
        }).lean()
    }
}

export { CartService }