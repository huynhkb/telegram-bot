import { supabase } from './supabase'

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL

// Helper to get the auth header
async function getAuthHeader() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) throw new Error('Not logged in')
  return `Bearer ${session.access_token}`
}

// Send a message to Telegram
export async function sendMessage(content: string) {
  const auth = await getAuthHeader()

  const res = await fetch(`${BACKEND_URL}/messages/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': auth
    },
    body: JSON.stringify({ content })
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to send message')
  }

  return res.json() // returns { success: true, message: {...} }
}

// Fetch message log from backend
export async function fetchMessages() {
  const auth = await getAuthHeader()

  const res = await fetch(`${BACKEND_URL}/messages`, {
    headers: {
      'Authorization': auth
    }
  })

  if (!res.ok) {
    const err = await res.json()
    throw new Error(err.error || 'Failed to fetch messages')
  }

  return res.json() // returns { messages: [...] }
}