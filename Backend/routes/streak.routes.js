import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { getStreak, recordActivity } from '../controllers/streak.controller.js'

const router = express.Router()

router.get('/', authMiddleware, getStreak)
router.post('/', authMiddleware, recordActivity)

export default router
