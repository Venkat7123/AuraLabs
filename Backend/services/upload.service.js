export const uploadPDF = async (supabase, file) => {
  const fileName = `pdfs/${Date.now()}-${file.originalname}`

  const { error } = await supabase.storage
    .from('syllabus-files')
    .upload(fileName, file.buffer, {
      contentType: file.mimetype
    })

  if (error) throw error

  const { data } = supabase.storage
    .from('syllabus-files')
    .getPublicUrl(fileName)

  return data.publicUrl
}