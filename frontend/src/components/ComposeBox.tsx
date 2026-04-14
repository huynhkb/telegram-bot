import { useState } from 'react'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
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
      onMessageSent(message) // bubble up to parent to update local state
      setContent('')         // clear the box
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Send on Ctrl+Enter or Cmd+Enter
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      handleSend()
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <Textarea
        placeholder="Type your message here... (Ctrl+Enter to send)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={4}
        disabled={loading}
      />

      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-400">
          {content.length} characters
        </span>
        <Button
          onClick={handleSend}
          disabled={loading || !content.trim()}
        >
          {loading ? 'Sending...' : 'Send to Channel'}
        </Button>
      </div>
    </div>
  )
}