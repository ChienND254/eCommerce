import { ObjectId } from "mongoose";
import { BadRequestError, NotFoundError } from "../core/error.response";
import { IDiscount } from "../interface/discount";
import { discountModel } from "../models/discount.model";
import { findAllProducts } from "../models/repositories/product.repo";
import { IProduct } from "../interface/product";
import { checkDiscountExists, findAllDiscountCodesUnSelect, updateDiscountById } from "../models/repositories/discount.repo";
import { removeUndefinedObject } from "../utils";

interface Params {
    code?: string,
    shopId?: ObjectId,
    userId?: ObjectId,
    limit?: number,
    page?: number,
    products?: IProduct[]
}

class DiscountService {
    static async createDiscountCode(body: Partial<IDiscount>): Promise<IDiscount> {
        const {
            discount_name, discount_description, discount_type, discount_value, discount_code,
            discount_start_date, discount_end_date, discount_max_uses, discount_uses_count,
            discount_users_used, discount_max_uses_per_user, discount_min_order_value, discount_max_value,
            discount_shopId, discount_is_active, discount_applies_to, discount_product_ids
        } = body;
        const now = new Date();

        if (!discount_code || !discount_name || !discount_type
            || !discount_value || !discount_start_date || !discount_end_date || !discount_shopId) {
            throw new Error('Missing required fields');
        }
        if (now > new Date(discount_end_date)) {
            throw new BadRequestError('Discount code has expired!')
        }

        if (new Date(discount_start_date) >= new Date(discount_end_date)) {
            throw new BadRequestError('Start Date must be before end_date')
        }

        const foundDiscount: IDiscount | null = await checkDiscountExists({
            model: discountModel, filter: {
                discount_code: discount_code,
                discount_shopId: discount_shopId
            }
        })

        if (foundDiscount && foundDiscount.discount_is_active) {
            throw new BadRequestError('Discount exists!')
        }

        const newDiscount: IDiscount = await discountModel.create({
            discount_name: discount_name,
            discount_description: discount_description,
            discount_type: discount_type,
            discount_value: discount_value,
            discount_code: discount_code,
            discount_start_date: discount_start_date,
            discount_end_date: discount_end_date,
            discount_max_uses: discount_max_uses,
            discount_uses_count: discount_uses_count,
            discount_users_used: discount_users_used,
            discount_max_uses_per_user: discount_max_uses_per_user,
            discount_min_order_value: discount_min_order_value,
            discount_max_value: discount_max_value,
            discount_shopId: discount_shopId,
            discount_is_active: discount_is_active,
            discount_applies_to: discount_applies_to,
            discount_product_ids: discount_applies_to === 'all' ? [] : discount_product_ids
        });

        return newDiscount
    }

    //update discount
    static async updateDiscount(discountId: ObjectId, bodyUpdate: Partial<IDiscount>): Promise<IDiscount | null> {
        const cleanedUpdate: Partial<IDiscount> = removeUndefinedObject(bodyUpdate);
        return await updateDiscountById({ discountId, bodyUpdate: cleanedUpdate, model: discountModel });
    }

    //get all product applied by discount code
    static async getAllDiscountCodesWithProduct({
        code, shopId, limit, page
    }: Params): Promise<Partial<IProduct>[]> {
        const foundDiscount: IDiscount | null = await checkDiscountExists({
            model: discountModel, filter: {
                discount_code: code,
                discount_shopId: shopId
            }
        })

        if (!foundDiscount || !foundDiscount.discount_is_active) {
            throw new NotFoundError('Discount not exists!')
        }

        const { discount_applies_to, discount_product_ids } = foundDiscount

        let products: IProduct[] = []
        if (discount_applies_to === 'all') {
            products = await findAllProducts({
                limit: limit ? +limit : 50,
                sort: 'ctime',
                page: page ? +page : 1,
                filter: {
                    product_shop: shopId,
                    isPublished: true,
                },
                select: ['product_name']
            })
        }

        if (discount_applies_to === 'specific') {
            products = await findAllProducts({
                limit: limit ? +limit : 50,
                sort: 'ctime',
                page: page ? +page : 1,
                filter: {
                    _id: { $in: discount_product_ids },
                    isPublished: true,
                },
                select: ['product_name']
            })
        }

        return products
    }

    //get all discount by shop
    static async getAllDiscountCodesByShop({
        limit, page, shopId
    }: Params) {
        const discounts = await findAllDiscountCodesUnSelect({
            limit: limit ? +limit : 50,
            page: page ? +page : 1,
            filter: {
                discount_shopId: shopId,
                discount_is_active: true,
            },
            unSelect: ['-__v', '-discount_shopId'],
            model: discountModel,
        })

        return discounts
    }

    //apply discount code
    static async getDiscountAmount({ code, userId, shopId, products }: Params) {
        const foundDiscount: IDiscount | null = await checkDiscountExists({
            model: discountModel, filter: {
                discount_code: code,
                discount_shopId: shopId
            }
        })

        if (!foundDiscount) throw new NotFoundError('Discount not found!')

        const {
            discount_is_active,
            discount_max_uses,
            discount_end_date,
            discount_min_order_value,
            discount_max_uses_per_user,
            discount_users_used,
            discount_type,
            discount_value
        } = foundDiscount

        if (!discount_is_active) throw new NotFoundError('discount expired!')

        if (!discount_max_uses) throw new NotFoundError('discount are out!')

        const now = new Date()
        if (now > new Date(discount_end_date)) {
            throw new NotFoundError('Discount code has expired!')
        }

        let totalOrder: number = 0
        if (discount_min_order_value > 0 && products) {
            totalOrder = products.reduce((acc, product: IProduct) => {
                return acc + (product.product_quantity * product.product_price)
            }, 0)

            if (totalOrder < discount_min_order_value) {
                throw new NotFoundError(`Discount required a minium order value ${discount_min_order_value}!`)
            }
        }

        if (discount_max_uses_per_user > 0) {
            const useUserDiscount = discount_users_used.find(user => user === userId)
            if (useUserDiscount) {

            }
        }

        const amount = discount_type === 'fixed_amount' ? discount_value : totalOrder * (discount_value / 100)

        return {
            totalOrder,
            dicount: amount,
            totalPrice: totalOrder - amount
        }
    }

    static async deleteDiscountCode({ shopId, code }: Params) {
        const deleted = await discountModel.findOneAndDelete({
            discount_code: code,
            discount_shopId: shopId
        })

        return deleted
    }

    static async cancelDiscountCode({ code, shopId, userId }: Params) {
        const foundDiscount: IDiscount | null = await checkDiscountExists({
            model: discountModel, filter: {
                discount_code: code,
                discount_shopId: shopId
            }
        })

        if (!foundDiscount) throw new NotFoundError('Discount not found')

        const results = await discountModel.findByIdAndUpdate(foundDiscount._id, {
            $pull: {
                disccount_users_used: userId,
            },
            $inc: {
                discount_max_uses: 1,
                discount_uses_count: -1
            }
        })

        return results
    }
}

export default DiscountService