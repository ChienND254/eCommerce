import express from 'express';
import discountController from '../../controllers/discount.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { authentication } from '../../auth/authUtils';

const router = express.Router()

router.get('/list_product_code', asyncHandler(discountController.getAllDiscountCodesWithProduct))
router.post('/amount', asyncHandler(discountController.getDiscountAmount))

router.use(authentication)

router.post('', asyncHandler(discountController.createDiscount))
router.patch('/:discountId', asyncHandler(discountController.updateDiscount))
router.get('', asyncHandler(discountController.getAllDiscountCodesByShop))

export default router