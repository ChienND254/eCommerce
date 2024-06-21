import { Request, Response, NextFunction } from 'express'
import ProductService from '../services/product.service';
import { SuccessResponse } from '../core/success.response';
import { ObjectId } from 'mongoose';

class ProductController {
    /**
     * @desc Create a new Product
     * @param {IProduct} 
     * @return {JSON}  
     */
    createProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, { ...req.body, product_shop: req.user?.userId })
        }).send(res)
    }

    /**
     * @desc Create a new Product
     * @param {Partial<IProduct>} 
     * @return {JSON}  
     */
    updateProduct = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'update Product success!',
            metadata: await ProductService.updateProduct(req.body.product_type, req.params.productId as unknown as ObjectId, {
                ...req.body,
                product_shop: req.user?.userId,
            })
        }).send(res)
    }
    /**
     * @desc publish product by shop
     * @return {JSON}  
     */
    publishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'publishProductByShop success!',
            metadata: await ProductService.publishProductByShop({
                product_shop: req.user?.userId as ObjectId,
                product_id: req.params.id as unknown as ObjectId,
            })
        }).send(res)
    }

    /**
     * @desc unPublish product by shop
     * @return {JSON}  
     */
    unPublishProductByShop = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'unPublishProductByShop success!',
            metadata: await ProductService.unPublishProductByShop({
                product_shop: req.user?.userId as ObjectId,
                product_id: req.params.id as any as ObjectId,
            })
        }).send(res)
    }
    /**
     * @desc GetAll Drafts for shop 
     * @param {number} limit
     * @param {number} skip
     * @return {JSON} 
     */
    getAllDraftsForShop = async (req: Request, res: Response) => {
        const drafts = await ProductService.findAllDraftsForShop({
            product_shop: req.user?.userId as ObjectId,
        });

        new SuccessResponse({
            message: 'Get list Draft success!',
            metadata: drafts
        }).send(res)
    }

    /**
     * @desc GetAll Drafts for shop 
     * @param {number} limit
     * @param {number} skip
     * @return {JSON} 
     */
    getAllPublishForShop = async (req: Request, res: Response) => {
        const published = await ProductService.findAllPublishForShop({
            product_shop: req.user?.userId as ObjectId,
        });

        new SuccessResponse({
            message: 'Get list Publish Product success!',
            metadata: published
        }).send(res)
    }

    /**
     * @desc search product
     * @param {string} keySearch
     * @return {JSON} 
     */
    getListSearchProduct = async (req: Request, res: Response) => {
        const { keySearch } = req.params

        new SuccessResponse({
            message: 'getListSearchProduct success!',
            metadata: await ProductService.getListSearchProduct(keySearch as string)
        }).send(res)
    }

    /**
     * @desc find all product
     * @param {string} keySearch
     * @return {JSON} 
     */
    findAllProducts = async (req: Request, res: Response) => {
        console.log(req.query);
        
        new SuccessResponse({
            message: 'Get all product success!',
            metadata: await ProductService.findAllProducts(req.query)
        }).send(res)
    }

    /**
     * @desc find product by id
     * @param {string} keySearch
     * @return {JSON} 
     */
    findProduct = async (req: Request, res: Response) => {
        new SuccessResponse({
            message: 'Get product by id success!',
            metadata: await ProductService.findProduct({
                product_id: req.params.product_id as unknown as ObjectId
            })
        }).send(res)
    }
}

export default new ProductController()