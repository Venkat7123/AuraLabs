import express from 'express'
import multer from 'multer'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { scanHomework, getHistory, clearHistory } from '../controllers/scan.controller.js'

const router = express.Router()
const upload = multer({ storage: multer.memoryStorage() })

router.post('/homework', authMiddleware, upload.single('file'), scanHomework)
router.get('/history/:subjectId', authMiddleware, getHistory)
router.delete('/history/:subjectId', authMiddleware, clearHistory)

export default router
