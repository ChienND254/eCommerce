import express from 'express';
import uploadController from '../../controllers/upload.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { uploadDisk, uploadMemory } from '../../configs/multer.config';
// import { authentication } from '../../auth/authUtils';

const router = express.Router()

// router.use(authentication)
router.post('/product', asyncHandler(uploadController.uploadFile))
router.post('/product/thumb', uploadDisk.single('file'), asyncHandler(uploadController.uploadThumb))
router.post('/product/multiple', uploadDisk.array('files', 3), asyncHandler(uploadController.uploadImageFromLocalFiles))
// upload s3
router.post('/product/bucket', uploadMemory.single('file'), asyncHandler(uploadController.uploadImageFromLocalS3))
export default router