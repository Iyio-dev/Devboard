import express from 'express'
import { signUp, signIn, getMe } from '../controllers/authController.js'
import authMiddleware from '../middlewares/authMiddleware.js'

const router = express.Router()

router.post('/sign-up/', signUp)
router.post('/sign-in/', signIn)
router.get('/me/', authMiddleware, getMe)

export default router
