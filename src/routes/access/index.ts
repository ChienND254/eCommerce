import express from 'express';
import accessController from '../../controllers/access.controller';
import { asyncHandler } from '../../helpers/asyncHandle';
import { authentication } from '../../auth/authUtils';

const router = express.Router()

router.post('/shop/signIn', asyncHandler(accessController.login))
router.post('/shop/signUp', asyncHandler(accessController.signUp))

router.use(authentication)
router.post('/shop/logout', asyncHandler(accessController.logout))
router.post('/shop/handleRefreshToken', asyncHandler(accessController.handleRefreshToken))

export default router