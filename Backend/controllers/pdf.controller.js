import multer from "multer"
import { uploadPDFToStorage } from "../services/storage.service.js"
import { extractPDFText } from "../services/pdf.service.js"
import { generateSyllabusFromPDFText } from "../services/ai.service.js"

const upload = multer({ storage: multer.memoryStorage() })

export const uploadPDFMiddleware = upload.single("file")

export const uploadAndGenerate = async (req, res, next) => {
  try {
    const userId = req.user.id

    // 1️⃣ Upload to storage
    const filePath = await uploadPDFToStorage(
      req.supabase,
      req.file,
      userId
    )

    // 2️⃣ Extract text
    const text = await extractPDFText(req.file.buffer)

    // 3️⃣ Generate syllabus
    const syllabus = await generateSyllabusFromPDFText(text)

    res.json({
      filePath,
      syllabus
    })

  } catch (err) {
    next(err)
  }
}