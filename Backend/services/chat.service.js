import { supabaseAdmin } from '../config/supabase.js'

// ── Get chat threads for a subject ──
export const getChatThreads = async (supabase, userId, subjectId) => {
    const { data, error } = await supabase
        .from('chat_threads')
        .select('*')
        .eq('user_id', userId)
        .eq('subject_id', subjectId)
        .order('updated_at', { ascending: false })

    if (error) throw error
    return data || []
}

// ── Create a new chat thread ──
export const createChatThread = async (supabase, userId, subjectId, name) => {
    const { data, error } = await supabase
        .from('chat_threads')
        .insert([{ user_id: userId, subject_id: subjectId, name }])
        .select()
        .single()

    if (error) throw error
    return data
}

// ── Get messages for a thread ──
export const getChatMessages = async (supabase, threadId) => {
    const { data, error } = await supabase
        .from('chat_messages')
        .select('*')
        .eq('thread_id', threadId)
        .order('created_at', { ascending: true })

    if (error) throw error
    return data || []
}

// ── Save a message ──
export const saveChatMessage = async (supabase, threadId, role, content) => {
    const { data, error } = await supabase
        .from('chat_messages')
        .insert([{ thread_id: threadId, role, content }])
        .select()
        .single()

    if (error) throw error
    return data
}

// ── Update thread name ──
export const updateThreadName = async (supabase, threadId, name) => {
    const { data, error } = await supabase
        .from('chat_threads')
        .update({ name, updated_at: new Date().toISOString() })
        .eq('id', threadId)
        .select()
        .single()

    if (error) throw error
    return data
}

// ── Delete a thread (messages cascade) ──
export const deleteThread = async (supabase, threadId) => {
    const { error } = await supabase
        .from('chat_threads')
        .delete()
        .eq('id', threadId)

    if (error) throw error
}

// ── Touch thread updated_at ──
export const touchThread = async (supabase, threadId) => {
    await supabase
        .from('chat_threads')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', threadId)
}
