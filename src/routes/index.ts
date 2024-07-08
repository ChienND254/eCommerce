import express from 'express';
import routerAccess from './access'
import routerProduct from './product'
import routerDiscount from './discount'
import routerInventory from './inventory'
import routerCart from './cart'
import routerComment from './comment'
import routerCheckout from './checkout' 
import routerNotification from './notification' 
import {apiKey, permission} from '../auth/checkAuth';
import { pushToLogDiscord } from '../middlewares';
const router = express.Router()
// router.use(pushToLogDiscord)
//check ApiKey
router.use(apiKey)
router.use(permission('0000'))

//check permission
router.use('/api/v1/checkout', routerCheckout)
router.use('/api/v1/discount', routerDiscount)
router.use('/api/v1/inventory', routerInventory)
router.use('/api/v1/cart', routerCart)
router.use('/api/v1/product', routerProduct)
router.use('/api/v1/comment', routerComment)
router.use('/api/v1/notification', routerNotification)
router.use('/api/v1', routerAccess)

export default router