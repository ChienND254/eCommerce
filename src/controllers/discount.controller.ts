import { Request, Response, NextFunction } from 'express'
import DiscountService from '../services/discount.service';
import { SuccessResponse } from '../core/success.response';
import { ObjectId } from 'mongoose';

class DiscountController {
    /**
     * @desc Create a new Discount
     * @param {IDiscount} 
     * @return {JSON}  
     */
    createDiscount = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Create new Discount success!',
            metadata: await DiscountService.createDiscountCode({ ...req.body, shopId: req.user?.userId })
        }).send(res)
    }

    /**
     * @desc Create a new Discount
     * @param {Partial<IDiscount>} 
     * @return {JSON}  
     */
    updateDiscount = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'update Discount success!',
            metadata: await DiscountService.updateDiscount(req.params.discountId as unknown as ObjectId, req.body)
        }).send(res)
    }

    /**
     * @desc get all product applier discount 
     * @param {string} keySearch
     * @return {JSON} 
     */
    getAllDiscountCodesWithProduct = async (req: Request, res: Response) => {
        new SuccessResponse({
            message: 'Get Discount by id success!',
            metadata: await DiscountService.getAllDiscountCodesWithProduct({
                ...req.query,
            })
        }).send(res)
    }

    /**
    * @desc get all product applier discount 
    * @param {string} keySearch
    * @return {JSON} 
    */
    getAllDiscountCodesByShop = async (req: Request, res: Response) => {
        new SuccessResponse({
            message: 'Get Discount by id success!',
            metadata: await DiscountService.getAllDiscountCodesByShop({
                shopId: req.user?.userId
            })
        }).send(res)
    }

    /**
    * @desc get all product applier discount 
    * @param {string} keySearch
    * @return {JSON} 
    */
    getDiscountAmount = async (req: Request, res: Response) => {
        new SuccessResponse({
            message: 'Get Discount by id success!',
            metadata: await DiscountService.getDiscountAmount({
                ...req.body
            })
        }).send(res)
    }
}

export default new DiscountController()