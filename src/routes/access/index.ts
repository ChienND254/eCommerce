import express from 'express';
import accessController from '../../controllers/access.controller';
import { asyncHandler } from '../../auth/checkAuth';

const router = express.Router()

router.post('/shop/signUp', asyncHandler(accessController.signUp))
router.post('/shop/signIn', asyncHandler(accessController.login))

export default router