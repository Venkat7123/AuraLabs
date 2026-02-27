import * as streakService from '../services/streak.service.js'

export const getStreak = async (req, res, next) => {
  try {
    const data = await streakService.getStreak(req.supabase, req.user.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}

export const recordActivity = async (req, res, next) => {
  try {
    const data = await streakService.recordActivity(req.supabase, req.user.id)
    res.json(data)
  } catch (err) {
    next(err)
  }
}
