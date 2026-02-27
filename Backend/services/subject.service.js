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

  // Return subject with topics joined
  return getSubject(supabase, userId, subject.id)
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