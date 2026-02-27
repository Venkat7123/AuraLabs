import * as topicService from '../services/topic.service.js'

export const getTopics = async (req, res, next) => {
  try {
    const data = await topicService.getTopics(req.supabase, req.params.subjectId)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const updateTopic = async (req, res, next) => {
  try {
    const data = await topicService.updateTopic(req.supabase, req.params.id, req.body.title)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const reorderTopics = async (req, res, next) => {
  try {
    const result = await topicService.reorderTopics(req.supabase, req.body.topics)
    res.json(result)
  } catch (err) {
    next(err)
  }
}

export const markTopicPassed = async (req, res, next) => {
  try {
    const data = await topicService.markTopicPassed(req.supabase, req.params.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}
