import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import { sendMessage, getThreads, getMessages, renameThread, removeThread } from '../controllers/chat.controller.js'

const router = express.Router()

router.post('/send', authMiddleware, sendMessage)
router.get('/threads/:subjectId', authMiddleware, getThreads)
router.get('/messages/:threadId', authMiddleware, getMessages)
router.put('/threads/:threadId', authMiddleware, renameThread)
router.delete('/threads/:threadId', authMiddleware, removeThread)

export default router
