import { useEffect, useState } from 'react'
import { fetchMessages } from '../lib/api'
import type { Message } from '../types/messages'
import ComposeBox from '../components/ComposeBox'
import MessageLog from '../components/MessageLog'
import LogoutButton from '../components/LogoutButton'

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [fetchError, setFetchError] = useState('')

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const { messages } = await fetchMessages()
        setMessages(messages)
      } catch (err: any) {
        setFetchError(err.message)
      } finally {
        setLoadingMessages(false)
      }
    }

    loadMessages()
  }, [])

  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [newMessage, ...prev])
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">

      {/* Sticky header */}
      <header className="sticky top-0 z-10 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-sm">
        <div className="max-w-2xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <span className="text-amber-500 text-lg leading-none select-none">₿</span>
            <span className="font-semibold text-sm text-zinc-100 tracking-tight">Channel Dashboard</span>
          </div>
          <LogoutButton />
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-2xl mx-auto px-6 py-8 flex flex-col gap-8">

        {/* Compose section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Send Message</h2>
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5">
            <ComposeBox onMessageSent={handleMessageSent} />
          </div>
        </section>

        {/* Message log section */}
        <section className="flex flex-col gap-3">
          <h2 className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">Message Log</h2>
          {fetchError ? (
            <p className="text-xs text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {fetchError}
            </p>
          ) : (
            <MessageLog messages={messages} loading={loadingMessages} />
          )}
        </section>

      </main>
    </div>
  )
}
