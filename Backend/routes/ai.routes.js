import express from 'express'
import { generateSyllabus } from '../controllers/ai.controller.js'
import { authMiddleware } from '../middleware/auth.middleware.js'

const router = express.Router()

router.post('/generate-syllabus', authMiddleware, generateSyllabus)

export default router