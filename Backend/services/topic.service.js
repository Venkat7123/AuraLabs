export const getTopics = async (supabase, subjectId) => {
  const { data, error } = await supabase
    .from('topics')
    .select('*')
    .eq('subject_id', subjectId)
    .order('topic_order', { ascending: true })

  if (error) throw error
  return data
}

export const reorderTopics = async (supabase, topics) => {
  for (const topic of topics) {
    await supabase
      .from('topics')
      .update({ topic_order: topic.order })
      .eq('id', topic.id)
  }

  return { message: 'Reordered successfully' }
}

export const updateTopic = async (supabase, id, title) => {
  const { data, error } = await supabase
    .from('topics')
    .update({ title })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export const markTopicPassed = async (supabase, id) => {
  const { data, error } = await supabase
    .from('topics')
    .update({ passed: true, passed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}