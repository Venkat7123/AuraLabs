import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
  getTopics,
  updateTopic,
  reorderTopics,
  markTopicPassed
} from '../controllers/topic.controller.js'

const router = express.Router()

// Get topics for a subject
router.get('/subject/:subjectId', authMiddleware, getTopics)

// Update a single topic title
router.patch('/:id', authMiddleware, updateTopic)

// Reorder topics for a subject
router.put('/reorder', authMiddleware, reorderTopics)

// Mark a topic as passed
router.post('/:id/pass', authMiddleware, markTopicPassed)

export default router
