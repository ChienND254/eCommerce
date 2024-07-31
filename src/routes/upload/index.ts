import express from 'express';
import uploadController from '../../controllers/upload.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { uploadDisk } from '../../configs/multer.config';
// import { authentication } from '../../auth/authUtils';

const router = express.Router()

// router.use(authentication)
router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadThumb))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles))
export default router