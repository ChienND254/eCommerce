import { Request, Response, NextFunction } from 'express'
import ProductService from '../services/product.service';
import { SuccessResponse } from '../core/success.response';

class ProductController {
    createProduct = async (req: Request, res: Response , next: NextFunction) => {        
        new SuccessResponse({
            message: 'Create new Product success!',
            metadata: await ProductService.createProduct(req.body.product_type, {...req.body, product_shop: req.user?.userId})
        }).send(res)
    }
}

export default new ProductController()