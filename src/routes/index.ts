import express from 'express';
import routerAccess from './access'
import routerProduct from './product'
import routerDiscount from './discount'
import routerInventory from './inventory'
import routerCart from './cart'
import routerCheckout from './checkout' 
import {apiKey, permission} from '../auth/checkAuth';
const router = express.Router()

//check ApiKey
router.use(apiKey)
router.use(permission('0000'))

//check permission
router.use('/v1/api/checkout', routerCheckout)
router.use('/v1/api/discount', routerDiscount)
router.use('/v1/api/inventory', routerInventory)
router.use('/v1/api/cart', routerCart)
router.use('/v1/api/product', routerProduct)
router.use('/v1/api', routerAccess)

export default router