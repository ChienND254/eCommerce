import { Request, Response, NextFunction } from 'express'
import { SuccessResponse } from '../core/success.response';
import { CartService } from '../services/cart.service';

class CartController {
    /**
     * @desc Create a new Cart
     * @param {ICart} 
     * @return {JSON}  
     */
    addToCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Create new Cart success!',
            metadata: await CartService.addToCart(req.body)
        }).send(res)
    }

    /**
      * @desc update Cart
      * @param {ICart} 
      * @return {JSON}  
      */
    updateCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'Create new Cart success!',
            metadata: await CartService.updateToCart(req.body)
        }).send(res)
    }

    /**
      * @desc delete Cart
      * @param {ICart} 
      * @return {JSON}  
      */
    deleteCart = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'delete Cart success!',
            metadata: await CartService.deleteUserCart(req.body)
        }).send(res)
    }

    /**
     * @desc list Cart
     * @param {UserId} 
     * @return {JSON}  
     */
    listToCart = async (req: Request, res: Response, next: NextFunction) => {
         new SuccessResponse({
            message: 'list Cart success!',
            metadata: await CartService.getListUserCart({userId: req.query.userId as unknown as number})
        }).send(res)
    }
}

export default new CartController()