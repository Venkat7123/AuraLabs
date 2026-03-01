import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
    getTopicContent,
    getQuizQuestions,
    generateTopicContent,
    saveQuizResult
} from '../controllers/content.controller.js'

const router = express.Router()

// Quiz routes MUST come before /:mode to prevent "quiz" matching as a mode
router.get('/:topicId/quiz', authMiddleware, getQuizQuestions)
router.post('/:topicId/quiz-result', authMiddleware, saveQuizResult)

// On-demand content generation for a single topic
router.post('/:topicId/generate', authMiddleware, generateTopicContent)

// Get content for a topic in a specific mode (must be last — :mode is a catch-all param)
router.get('/:topicId/:mode', authMiddleware, getTopicContent)

export default router
