export const getScanHistory = async (supabase, userId, subjectId) => {
  const { data, error } = await supabase
    .from('scan_history')
    .select('*')
    .eq('user_id', userId)
    .eq('subject_id', subjectId)
    .order('created_at', { ascending: true })

  if (error) throw error
  return data
}

export const addScanEntry = async (supabase, userId, subjectId, entry) => {
  const { data, error } = await supabase
    .from('scan_history')
    .insert([{
      user_id: userId,
      subject_id: subjectId,
      role: entry.role,
      image_url: entry.image_url || null,
      text: entry.text || null,
    }])
    .select()
    .single()

  if (error) throw error
  return data
}

export const clearScanHistory = async (supabase, userId, subjectId) => {
  const { error } = await supabase
    .from('scan_history')
    .delete()
    .eq('user_id', userId)
    .eq('subject_id', subjectId)

  if (error) throw error
}
