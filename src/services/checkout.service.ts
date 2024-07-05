import { ObjectId } from "mongoose";
import { findCartById } from "../models/repositories/cart.repo";
import { BadRequestError } from "../core/error.response";
import { checkProductByServer } from "../models/repositories/product.repo";
import DiscountService from "./discount.service";
import { IProduct } from "../interfaces";
import { acquireLock, releaseLock } from "./redis.service";
import { OrderModel } from "../models/order.model";
import { CartService } from "./cart.service";

class CheckoutService {
    /**
     * This method reviews the checkout process by validating the cart and calculating the total price, discounts, and other details.
     */
    static async checkoutReview({
        cartId, userId, shop_order_ids
    }: { cartId: ObjectId, userId: number, shop_order_ids: any }) {
        const foundCart = await findCartById(cartId)

        if (!foundCart) throw new BadRequestError('Cart does not exists!')

        const checkoutOrder = {
            totalPrice: 0,
            feeShip: 0,
            totalDiscount: 0,
            totalCheckout: 0,
        }
        const shop_order_ids_new = []

        // Iterate through each shop order to calculate prices and discounts
        for (let index = 0; index < shop_order_ids.length; index++) {
            const { shopId, shop_discounts = [], item_products = [] } = shop_order_ids[index]

            // Validate products with server
            const checkProductServer = await checkProductByServer(item_products)

            if (!checkProductServer[0]) {
                throw new BadRequestError("Order contains invalid products!");
            }

            // Filter out valid products and calculate the total price
            const validProducts = checkProductServer.filter(product => product !== null) as Partial<IProduct>[];
            const checkoutPrice = validProducts.reduce((acc, product) => {
                if (product && product.product_price && product.product_quantity) {
                    return acc + (product.product_price * product.product_quantity);
                }
                return acc;
            }, 0);

            checkoutOrder.totalPrice += checkoutPrice

            const itemCheckout = {
                shopId,
                shop_discounts,
                priceRaw: checkoutPrice,
                priceApplyDiscount: checkoutPrice,
                item_products: checkProductServer
            }

            // Apply discounts if available
            if (shop_discounts.length > 0) {
                const { totalPrice = 0, discount = 0 } = await DiscountService.getDiscountAmount({
                    code: shop_discounts[0].codeId,
                    userId,
                    shopId,
                    products: validProducts
                })

                checkoutOrder.totalDiscount += discount

                if (discount > 0) {
                    itemCheckout.priceApplyDiscount = checkoutPrice - discount
                }
            }

            checkoutOrder.totalCheckout += itemCheckout.priceApplyDiscount
            shop_order_ids_new.push(itemCheckout)
        }

        return {
            shop_order_ids,
            shop_order_ids_new,
            checkoutOrder
        }
    }

    /**
    * This method processes the user's order by validating the cart, acquiring product locks, and creating the order.
    */
    static async orderByUser({
        cartId,
        userId,
        user_address,
        shop_order_ids,
        user_payment
    }: { cartId: ObjectId, userId: number, user_address: any, shop_order_ids: any, user_payment: any }) {
        const { shop_order_ids_new, checkoutOrder } = await CheckoutService.checkoutReview({
            cartId, userId, shop_order_ids: shop_order_ids
        })

        const products = shop_order_ids_new.flatMap(order => order.item_products)
        const acquireProduct = []

        // Acquire locks for each product
        for (let index = 0; index < products.length; index++) {
            const product = products[index];
            if (product) {
                const { productId, product_quantity } = product;
                if (productId && product_quantity) {
                    const keyLock = await acquireLock(productId, product_quantity, cartId)
                    acquireProduct.push(keyLock ? true : false)
                    if (keyLock) {
                        await releaseLock(keyLock)
                    }
                }
            }
        }

        // If any product lock acquisition fails, throw an error 
        if (acquireProduct.includes(false)) {
            throw new BadRequestError('Some product is update, back cart')
        }

        // Create a new order in the database
        const newOrder = await OrderModel.create({
            order_userId: userId,
            order_checkout: checkoutOrder,
            order_shipping: user_address,
            order_payment: user_payment,
            order_products: shop_order_ids_new
        })

        if (newOrder) {
        }
        return newOrder
    }

    static async getOrderByUser() {

    }

    static async getOneOrderByUser() {
        
    }

    static async cancelOrderByUser() {
        
    }

    // update order by shop | admin
    static async updateOrderStatusByShop() {
        
    }
}

export default CheckoutService;