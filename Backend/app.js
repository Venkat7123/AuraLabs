import express from 'express'
import cors from 'cors'

import subjectRoutes from './routes/subject.routes.js'
import topicRoutes from './routes/topic.routes.js'
import aiRoutes from './routes/ai.routes.js'
import streakRoutes from './routes/streak.routes.js'
import { errorHandler } from './middleware/error.middleware.js'

const app = express()

// ── Middleware ──────────────────────────────────────────────
app.use(cors())
app.use(express.json())

// ── Routes ─────────────────────────────────────────────────
app.use('/api/subjects', subjectRoutes)
app.use('/api/topics', topicRoutes)
app.use('/api/ai', aiRoutes)
app.use('/api/user/streak', streakRoutes)

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))

// ── Error handler (must be last) ───────────────────────────
app.use(errorHandler)

export default app