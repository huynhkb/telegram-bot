import type { Message } from '../types/messages'

type Props = {
  messages: Message[]
  loading: boolean
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleString()
}

export default function MessageLog({ messages, loading }: Props) {
  if (loading) {
    return (
      <div className="flex flex-col gap-2">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 animate-pulse">
            <div className="h-3 bg-zinc-800 rounded w-3/4 mb-2" />
            <div className="h-3 bg-zinc-800 rounded w-1/2" />
          </div>
        ))}
      </div>
    )
  }

  if (messages.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-10 text-center">
        <p className="text-zinc-600 text-sm">No messages sent yet.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      {messages.map((msg) => (
        <div key={msg.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition-colors">
          <p className="text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">
            {msg.content}
          </p>
          <p className="text-xs text-zinc-600 mt-2 font-mono">
            {formatDate(msg.sent_at)}
          </p>
        </div>
      ))}
    </div>
  )
}
