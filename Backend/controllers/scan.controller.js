import { solveHomeworkFromImage } from '../services/ai.service.js'
import { getScanHistory, addScanEntry, clearScanHistory } from '../services/scan.service.js'
import { supabaseAdmin } from '../config/supabase.js'

export const scanHomework = async (req, res, next) => {
    try {
        const file = req.file
        const subjectId = req.body.subject_id || req.query.subject_id
        const question = req.body.question || ''
        if (!file) return res.status(400).json({ error: 'No image file uploaded' })
        if (!subjectId) return res.status(400).json({ error: 'subject_id is required' })

        const userId = req.user.id

        // Ensure bucket exists (uses admin client — no RLS restrictions)
        const { data: buckets } = await supabaseAdmin.storage.listBuckets()
        const bucketExists = buckets?.some(b => b.name === 'scan-images')
        if (!bucketExists) {
            const { error: createErr } = await supabaseAdmin.storage.createBucket('scan-images', {
                public: true,
                fileSizeLimit: 10 * 1024 * 1024, // 10MB
            })
            if (createErr) console.error('Bucket creation error:', createErr)
            else console.log('Created scan-images bucket')
        }

        // Upload image using admin client (bypasses storage RLS)
        const fileName = `${userId}/${subjectId}/${Date.now()}-${file.originalname || 'homework.png'}`
        const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
            .from('scan-images')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            })

        if (uploadError) {
            console.error('Supabase Storage upload error:', uploadError)
        }

        let imageUrl = null
        if (!uploadError && uploadData?.path) {
            const { data: urlData } = supabaseAdmin.storage
                .from('scan-images')
                .getPublicUrl(uploadData.path)
            imageUrl = urlData?.publicUrl || null
            console.log('Image uploaded successfully:', imageUrl)
        }

        // Fetch subject language
        const { data: subjectData } = await supabaseAdmin
            .from('subjects')
            .select('language')
            .eq('id', subjectId)
            .single()
        const language = subjectData?.language || 'English'

        // Save user message
        await addScanEntry(req.supabase, userId, subjectId, {
            role: 'user',
            image_url: imageUrl,
            text: question || null,
        })

        // Get AI answer (pass question + language for context)
        const answer = await solveHomeworkFromImage(file.buffer, file.mimetype, question, language)

        // Save AI response
        await addScanEntry(req.supabase, userId, subjectId, {
            role: 'ai',
            text: answer,
        })

        res.json({ answer, image_url: imageUrl })
    } catch (err) {
        next(err)
    }
}

export const getHistory = async (req, res, next) => {
    try {
        const subjectId = req.params.subjectId
        const data = await getScanHistory(req.supabase, req.user.id, subjectId)
        res.json(data)
    } catch (err) {
        next(err)
    }
}

export const clearHistory = async (req, res, next) => {
    try {
        const subjectId = req.params.subjectId
        await clearScanHistory(req.supabase, req.user.id, subjectId)
        res.status(204).send()
    } catch (err) {
        next(err)
    }
}
