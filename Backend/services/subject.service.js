import { supabaseAdmin } from '../config/supabase.js'
import { generateContentForSubject } from './content.service.js'

export const createSubject = async (supabase, userId, body) => {
  const { syllabus, ...subjectData } = body

  const { data: subject, error } = await supabase
    .from('subjects')
    .insert([
      {
        ...subjectData,
        user_id: userId
      }
    ])
    .select()
    .single()

  if (error) throw error

  if (syllabus?.length) {
    const topics = syllabus.map((t, index) => ({
      subject_id: subject.id,
      title: t.title,
      topic_order: index
    }))

    const { error: topicError } = await supabase.from('topics').insert(topics)
    if (topicError) throw topicError
  }

  // Get the full subject with topics to return immediately
  const result = await getSubject(supabase, userId, subject.id)

  // Fire-and-forget: generate AI content in background
  generateContentForSubject(supabaseAdmin, {
    subjectId: subject.id,
    subjectName: subject.name,
    language: subjectData.language || 'English',
    userId
  }).catch(err => console.error('Background content generation failed:', err.message))

  return result
}

export const getSubjects = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      topics(*)
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error

  return data
}

export const getSubject = async (supabase, userId, id) => {
  const { data, error } = await supabase
    .from('subjects')
    .select(`
      *,
      topics(*)
    `)
    .eq('id', id)
    .eq('user_id', userId)
    .single()

  if (error) throw error

  // Sort topics by order
  if (data?.topics) {
    data.topics.sort((a, b) => a.topic_order - b.topic_order)
  }

  return data
}

export const updateSubject = async (supabase, userId, id, updates) => {
  const { data, error } = await supabase
    .from('subjects')
    .update(updates)
    .eq('id', id)
    .eq('user_id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export const deleteSubject = async (supabase, userId, id) => {
  // Topics should be cascade-deleted by DB FK, but delete explicitly just in case
  await supabase.from('topics').delete().eq('subject_id', id)

  const { error } = await supabase
    .from('subjects')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

export const resetAndUpdateSubject = async (supabase, userId, id, body) => {
  const { syllabus, ...subjectData } = body

  // 1. Update subject fields
  const { error: updateError } = await supabase
    .from('subjects')
    .update(subjectData)
    .eq('id', id)
    .eq('user_id', userId)

  if (updateError) throw updateError

  // 2. Delete all existing topics (cascade deletes topic_contents, quiz_questions)
  const { error: deleteError } = await supabase
    .from('topics')
    .delete()
    .eq('subject_id', id)

  if (deleteError) throw deleteError

  // 3. Insert new topics from syllabus
  if (syllabus?.length) {
    const topics = syllabus.map((t, index) => ({
      subject_id: id,
      title: t.title,
      topic_order: index
    }))

    const { error: topicError } = await supabase.from('topics').insert(topics)
    if (topicError) throw topicError
  }

  // 4. Get refreshed subject with topics
  const result = await getSubject(supabase, userId, id)

  // 5. Fire-and-forget: generate AI content in background
  generateContentForSubject(supabaseAdmin, {
    subjectId: id,
    subjectName: subjectData.name || result.name,
    language: subjectData.language || result.language || 'English',
    userId
  }).catch(err => console.error('Background content generation failed:', err.message))

  return result
}