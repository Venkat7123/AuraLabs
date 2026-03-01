import { supabaseAdmin } from '../config/supabase.js'
import * as aiService from './ai.service.js'

// ── Generate & store content for a single topic (all modes + quiz) ──
export const generateAndStoreTopicContent = async (supabase, { topicId, topicTitle, subjectName, language, userId }) => {
    const lang = language || 'English'
    const modes = ['explain', 'demonstrate', 'try', 'apply']

    // Generate content for all 4 modes in parallel
    const contentPromises = modes.map(async (mode) => {
        try {
            const content = await aiService.generateTopicContent({
                topicTitle, subjectName, mode, language: lang
            })
            return { topic_id: topicId, mode, lang, content }
        } catch (err) {
            console.error(`Failed to generate ${mode} content for "${topicTitle}":`, err.message)
            return { topic_id: topicId, mode, lang, content: `Content generation failed. Please try regenerating.` }
        }
    })

    // Generate quiz questions
    const quizPromise = (async () => {
        try {
            return await aiService.generateQuizQuestions({
                topicTitle, subjectName, language: lang
            })
        } catch (err) {
            console.error(`Failed to generate quiz for "${topicTitle}":`, err.message)
            return []
        }
    })()

    const [contentResults, quizQuestions] = await Promise.all([
        Promise.all(contentPromises),
        quizPromise
    ])

    // Upsert content (unique constraint: topic_id, mode, lang)
    if (contentResults.length) {
        const { error } = await supabase
            .from('topic_contents')
            .upsert(contentResults, { onConflict: 'topic_id,mode,lang' })

        if (error) console.error('Failed to store topic content:', error.message)
    }

    // Insert quiz questions
    if (quizQuestions.length) {
        // Delete existing quiz questions for this topic + lang first
        await supabase
            .from('quiz_questions')
            .delete()
            .eq('topic_id', topicId)
            .eq('lang', lang)

        const quizRows = quizQuestions.map(q => ({
            topic_id: topicId,
            user_id: userId,
            lang,
            question: q.question,
            options: q.options,
            correct_index: q.correct_index
        }))

        const { error } = await supabase
            .from('quiz_questions')
            .insert(quizRows)

        if (error) console.error('Failed to store quiz questions:', error.message)
    }

    return { contentCount: contentResults.length, quizCount: quizQuestions.length }
}

// ── Generate content for ALL topics of a subject (background) ──
export const generateContentForSubject = async (supabase, { subjectId, subjectName, language, userId }) => {
    // Get all topics for the subject
    const { data: topics, error } = await supabase
        .from('topics')
        .select('id, title')
        .eq('subject_id', subjectId)
        .order('topic_order', { ascending: true })

    if (error || !topics?.length) {
        console.error('No topics found for content generation:', error?.message)
        return
    }

    console.log(`🚀 Starting content generation for ${topics.length} topics in "${subjectName}" (${language})`)

    // Generate sequentially to avoid API rate limits
    for (const topic of topics) {
        try {
            const result = await generateAndStoreTopicContent(supabase, {
                topicId: topic.id,
                topicTitle: topic.title,
                subjectName,
                language,
                userId
            })
            console.log(`✅ "${topic.title}" — ${result.contentCount} modes + ${result.quizCount} quiz questions`)
        } catch (err) {
            console.error(`❌ Failed "${topic.title}":`, err.message)
        }
    }

    console.log(`🎉 Content generation complete for "${subjectName}"`)
}

// ── Get topic content for a specific mode ──
export const getTopicContent = async (supabase, topicId, mode, lang = 'English') => {
    const { data, error } = await supabase
        .from('topic_contents')
        .select('*')
        .eq('topic_id', topicId)
        .eq('mode', mode)
        .eq('lang', lang)
        .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
    return data
}

// ── Get quiz questions for a topic ──
export const getQuizQuestions = async (supabase, topicId, lang = 'English') => {
    const { data, error } = await supabase
        .from('quiz_questions')
        .select('*')
        .eq('topic_id', topicId)
        .eq('lang', lang)
        .limit(10)

    if (error) throw error
    return data || []
}

// ── Delete all content for given topic IDs ──
export const deleteContentForTopics = async (supabase, topicIds) => {
    if (!topicIds?.length) return

    const { error: contentErr } = await supabase
        .from('topic_contents')
        .delete()
        .in('topic_id', topicIds)

    if (contentErr) console.error('Failed to delete topic content:', contentErr.message)

    const { error: quizErr } = await supabase
        .from('quiz_questions')
        .delete()
        .in('topic_id', topicIds)

    if (quizErr) console.error('Failed to delete quiz questions:', quizErr.message)
}

// ── Save quiz result to user_topic_progress ──
export const saveQuizResult = async (supabase, { userId, topicId, passed, score }) => {
    const { data, error } = await supabase
        .from('user_topic_progress')
        .upsert({
            user_id: userId,
            topic_id: topicId,
            quiz_passed: passed,
            score,
            updated_at: new Date().toISOString()
        }, { onConflict: 'user_id,topic_id' })
        .select()
        .single()

    if (error) throw error
    return data
}
