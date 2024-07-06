import express from 'express';
import notificationController from '../../controllers/notification.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { authentication } from '../../auth/authUtils';

const router = express.Router()

router.use(authentication)

router.get('', asyncHandler(notificationController.listNotiByUser))

export default router