import { Request, Response, NextFunction } from 'express'
import { SuccessResponse } from '../core/success.response';
import CheckoutService from '../services/checkout.service';

class CheckoutController {
    /**
      * @desc checkout cart
      * @param {ICart} 
      * @return {JSON}  
      */
    checkoutReview = async (req: Request, res: Response, next: NextFunction) => {
        new SuccessResponse({
            message: 'checkout success!',
            metadata: await CheckoutService.checkoutReview(req.body)
        }).send(res)
    }
}

export default new CheckoutController()