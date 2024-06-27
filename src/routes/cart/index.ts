import express from 'express';
import cartController from '../../controllers/cart.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { authentication } from '../../auth/authUtils';

const router = express.Router()

router.post('/add', asyncHandler(cartController.addToCart))
router.post('/update', asyncHandler(cartController.updateCart))
router.delete('/delete', asyncHandler(cartController.deleteCart))
router.get('', asyncHandler(cartController.listToCart))

export default router