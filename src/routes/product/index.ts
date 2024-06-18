import express from 'express';
import productController from '../../controllers/product.controller';
import { asyncHandler } from '../../helpers/asyncHandle';

const router = express.Router()

router.post('', asyncHandler(productController.createProduct))

//query
router.get('/drafts/all', asyncHandler(productController.createProduct))
export default router