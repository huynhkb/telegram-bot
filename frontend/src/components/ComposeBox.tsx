import { useState } from 'react'
import { sendMessage } from '../lib/api'
import type { Message } from '../types/messages'

type Props = {
  onMessageSent: (message: Message) => void
}

export default function ComposeBox({ onMessageSent }: Props) {
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSend = async () => {
    if (!content.trim()) return
    setLoading(true)
    setError('')

    try {
      const { message } = await sendMessage(content.trim())
      onMessageSent(message)
      setContent('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <textarea
        placeholder="Type your message... (Ctrl+Enter to send)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        disabled={loading}
        className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 resize-none focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/50 disabled:opacity-50 transition-all"
      />

      {error && (
        <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-between items-center">
        <span className="text-xs text-zinc-600">
          {content.length} characters
        </span>
        <button
          onClick={handleSend}
          disabled={loading || !content.trim()}
          className="bg-amber-500 hover:bg-amber-400 disabled:opacity-40 disabled:cursor-not-allowed text-zinc-950 font-semibold text-xs rounded-lg px-4 py-2 transition-colors"
        >
          {loading ? 'Sending...' : 'Send to Channel'}
        </button>
      </div>
    </div>
  )
}
