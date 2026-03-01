import express from "express"
import { uploadPDFMiddleware, uploadAndGenerate } from "../controllers/pdf.controller.js"
import { authMiddleware } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post(
  "/upload-pdf",
  authMiddleware,
  uploadPDFMiddleware,
  uploadAndGenerate
)

export default router