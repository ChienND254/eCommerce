import express from 'express';
import commentController from '../../controllers/comment.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { authentication } from '../../auth/authUtils';

const router = express.Router()

router.get('', asyncHandler(commentController.getComment))
router.use(authentication)

router.post('', asyncHandler(commentController.createComment))
router.delete('', asyncHandler(commentController.deleteComment))

export default router