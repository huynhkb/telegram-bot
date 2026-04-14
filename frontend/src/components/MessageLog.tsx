import type { Message } from '../types/messages'
import { Card, CardContent } from './ui/card'

type Props = {
  messages: Message[]
  loading: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}

export default function MessageLog({ messages, loading }: Props) {
  if (loading) {
    return <p className="text-gray-400 text-sm">Loading messages...</p>
  }

  if (messages.length === 0) {
    return <p className="text-gray-400 text-sm">No messages sent yet.</p>
  }

  return (
    <div className="flex flex-col gap-3">
      {messages.map((msg) => (
        <Card key={msg.id}>
          <CardContent className="pt-4">
            <p className="text-sm text-gray-800 whitespace-pre-wrap">
              {msg.content}
            </p>
            <p className="text-xs text-gray-400 mt-2">
              {formatDate(msg.sent_at)}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}