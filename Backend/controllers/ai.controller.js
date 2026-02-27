import * as aiService from '../services/ai.service.js'

export const generateSyllabus = async (req, res, next) => {
  try {
    const result = await aiService.generateSyllabus(req.body)
    res.json(result)
  } catch (err) {
    next(err)
  }
}