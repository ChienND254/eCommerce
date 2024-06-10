import express from 'express';
import routerAccess from './access/index'
import {apiKey, permission} from '../auth/checkAuth';
const router = express.Router()

//check ApiKey
router.use(apiKey)
router.use(permission('0000'))
//check permission
router.use('/v1/api', routerAccess)

export default router