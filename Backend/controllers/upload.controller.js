import multer from 'multer'
import { uploadPDF } from '../services/upload.service.js'

const upload = multer({ storage: multer.memoryStorage() })

export const uploadMiddleware = upload.single('file')

export const uploadFile = async (req, res, next) => {
  try {
    const fileUrl = await uploadPDF(req.supabase, req.file)
    res.json({ fileUrl })
  } catch (err) {
    next(err)
  }
}