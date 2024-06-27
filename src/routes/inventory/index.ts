import express from 'express';
import { asyncHandler } from '../../helpers/asyncHandle';
import inventoryController from '../../controllers/inventory.controller';
import { authentication } from '../../auth/authUtils';

const router = express.Router()

router.use(authentication)
router.post('', asyncHandler(inventoryController.addStockToInventory))

export default router