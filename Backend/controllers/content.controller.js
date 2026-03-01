import * as contentService from '../services/content.service.js'

// GET /api/content/:topicId/:mode — Get content for a topic + mode
export const getTopicContent = async (req, res, next) => {
    try {
        const { topicId, mode } = req.params
        const lang = req.query.lang || 'English'

        const data = await contentService.getTopicContent(req.supabase, topicId, mode, lang)

        if (!data) {
            return res.json({ content: null, status: 'not_generated' })
        }

        res.json(data)
    } catch (err) {
        next(err)
    }
}

// GET /api/content/:topicId/quiz — Get quiz questions
export const getQuizQuestions = async (req, res, next) => {
    try {
        const { topicId } = req.params
        const lang = req.query.lang || 'English'

        const data = await contentService.getQuizQuestions(req.supabase, topicId, lang)
        res.json(data)
    } catch (err) {
        next(err)
    }
}

// POST /api/content/:topicId/generate — On-demand generation for a single topic
export const generateTopicContent = async (req, res, next) => {
    try {
        const { topicId } = req.params
        const { topicTitle, subjectName, language } = req.body

        const result = await contentService.generateAndStoreTopicContent(
            req.supabase,
            {
                topicId,
                topicTitle: topicTitle || 'Topic',
                subjectName: subjectName || 'Subject',
                language: language || 'English',
                userId: req.user.id
            }
        )

        res.json({ success: true, ...result })
    } catch (err) {
        next(err)
    }
}

// POST /api/content/:topicId/quiz-result — Save quiz result
export const saveQuizResult = async (req, res, next) => {
    try {
        const { topicId } = req.params
        const { passed, score } = req.body

        const data = await contentService.saveQuizResult(req.supabase, {
            userId: req.user.id,
            topicId,
            passed,
            score
        })

        res.json(data)
    } catch (err) {
        next(err)
    }
}
