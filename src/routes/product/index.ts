import express from 'express';
import productController from '../../controllers/product.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { authentication } from '../../auth/authUtils';

const router = express.Router()
router.get('/search/:keySearch', asyncHandler(productController.getListSearchProduct))
router.use(authentication)

router.post('', asyncHandler(productController.createProduct))
router.post('/publish/:id', asyncHandler(productController.publishProductByShop))
router.post('/unpublish/:id', asyncHandler(productController.unPublishProductByShop))

//query
router.get('/drafts/all', asyncHandler(productController.getAllDraftsForShop))
router.get('/published/all', asyncHandler(productController.getAllPublishForShop))
export default router