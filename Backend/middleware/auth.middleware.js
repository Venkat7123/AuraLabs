import { createClient } from '@supabase/supabase-js'

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) return res.status(401).json({ error: 'No token provided' })

    // Create a one-off Supabase client authenticated with the user's JWT
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY,
      {
        global: {
          headers: { Authorization: `Bearer ${token}` }
        }
      }
    )

    // Verify the token and get the user
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' })
    }

    req.user = user          // { id, email, ... }
    req.supabase = supabase  // authenticated client for RLS if needed
    next()
  } catch (err) {
    res.status(401).json({ error: 'Unauthorized' })
  }
}