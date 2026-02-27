// Lightweight fetch wrapper for calling the Express backend.
// Automatically attaches the Supabase access token for authentication.

import { supabase } from '@/lib/supabase'

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'

export async function apiFetch(path, options = {}) {
  // Get the current session token
  const { data: { session } } = await supabase.auth.getSession()
  const token = session?.access_token

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {})
    }
  })

  if (!res.ok) {
    let msg = `API error ${res.status}`
    try {
      const body = await res.json()
      if (body.error) msg = body.error
    } catch {
      // response wasn't JSON (e.g. HTML error page) — use status text
      if (res.status >= 500) msg = 'Server is temporarily unavailable. Please try again.'
    }
    throw new Error(msg)
  }

  if (res.status === 204) return null
  return res.json()
}
