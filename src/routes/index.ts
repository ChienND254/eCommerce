import express from 'express';
import routerSignup from './access/index'
const router = express.Router()

//checkApi

//check permission
router.use('/v1/api', routerSignup)

export default router