export const uploadPDFToStorage = async (
  supabase,
  file,
  userId
) => {

  const fileName = `${userId}/${Date.now()}.pdf`

  const { error } = await supabase.storage
    .from("curriculum-files")
    .upload(fileName, file.buffer, {
      contentType: "application/pdf"
    })

  if (error) throw error

  return fileName
}