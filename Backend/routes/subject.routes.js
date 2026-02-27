import express from 'express'
import { authMiddleware } from '../middleware/auth.middleware.js'
import {
  getSubjects,
  getSubject,
  createSubject,
  updateSubject,
  deleteSubject
} from '../controllers/subject.controller.js'

const router = express.Router()

router.get('/', authMiddleware, getSubjects)
router.get('/:id', authMiddleware, getSubject)
router.post('/', authMiddleware, createSubject)
router.patch('/:id', authMiddleware, updateSubject)
router.delete('/:id', authMiddleware, deleteSubject)

export default router
