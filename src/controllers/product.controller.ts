import { Request, Response, NextFunction } from 'express'
import ProductService from '../services/product.service';
import { SuccessResponse } from '../core/success.response';

class ProductController {
    /**
     * @desc Create a new Product
     * @param next
     * @return {JSON}  
     */
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, { ...req.body, product_shop: req.user?.userId })
        }).send(res)
    }
    /**
     * @desc GetAll Drafts for shop 
     * @param {number} limit
     * @param {number} skip
     * @return {JSON} 
     */
    getAllDraftsForShop = async (req: Request, res: Response) => {
        const productShopId = req.user?.userId;
        if (!productShopId) {
            throw new Error("User ID is missing");
        }
        const drafts = await ProductService.findAllDraftsForShop({
            product_shop: productShopId,
        });

        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: drafts
        }).send(res)
    }
}

export default new ProductController()