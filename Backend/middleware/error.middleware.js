export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message?.slice(0, 200))
  const status = err.status || 500
  // If the upstream (e.g. Supabase) returned HTML or a very long message, show a
  // clean short message to the client instead of leaking raw HTML.
  let msg = err.message || 'Internal server error'
  if (msg.length > 300 || msg.includes('<!DOCTYPE') || msg.includes('<html')) {
    msg = 'Upstream service is temporarily unavailable. Please try again later.'
  }
  res.status(status).json({ error: msg })
}
