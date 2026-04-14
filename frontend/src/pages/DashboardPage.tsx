import { useEffect, useState } from 'react'
import { fetchMessages } from '../lib/api'
import type { Message } from '../types/messages'
import ComposeBox from '../components/ComposeBox'
import MessageLog from '../components/MessageLog'
import LogoutButton from '../components/LogoutButton'
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card'

export default function DashboardPage() {
  const [messages, setMessages] = useState<Message[]>([])
  const [loadingMessages, setLoadingMessages] = useState(true)
  const [fetchError, setFetchError] = useState('')
  
  // Load message history on mount
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

  // Called by ComposeBox when a message is successfully sent
  // Prepend to local state instead of refetching from server
  const handleMessageSent = (newMessage: Message) => {
    setMessages((prev) => [newMessage, ...prev])
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto flex flex-col gap-6">

        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Channel Dashboard</h1>
          <LogoutButton />
        </div>

        {/* Compose Box */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Send Message</CardTitle>
          </CardHeader>
          <CardContent>
            <ComposeBox onMessageSent={handleMessageSent} />
          </CardContent>
        </Card>

        {/* Message Log */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Message Log</CardTitle>
          </CardHeader>
          <CardContent>
            {fetchError ? (
              <p className="text-sm text-red-500">{fetchError}</p>
            ) : (
              <MessageLog messages={messages} loading={loadingMessages} />
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  )

  
}

