export const getStreak = async (supabase, userId) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('streak_data')
    .eq('user_id', userId)
    .maybeSingle()

  if (error) throw error
  return data?.streak_data || {}
}

export const recordActivity = async (supabase, userId) => {
  const today = new Date().toISOString().split('T')[0]

  // Get current streak data
  const { data: profile } = await supabase
    .from('user_profiles')
    .select('streak_data')
    .eq('user_id', userId)
    .maybeSingle()

  const streakData = profile?.streak_data || {}
  streakData[today] = (streakData[today] || 0) + 1

  // Upsert
  const { data, error } = await supabase
    .from('user_profiles')
    .upsert(
      {
        user_id: userId,
        streak_data: streakData,
        updated_at: new Date().toISOString()
      },
      { onConflict: 'user_id' }
    )
    .select()
    .single()

  if (error) throw error
  return data.streak_data
}
