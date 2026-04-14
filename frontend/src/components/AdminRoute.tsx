import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

type Props = {
  children: React.ReactNode
}

export default function AdminRoute({ children }: Props) {
  const navigate = useNavigate()
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    const checkAdmin = async () => {
      // Wait for Supabase to restore session
      const { data: { session } } = await supabase.auth.getSession()

      if (!session) {
        navigate('/login')
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', session.user.id)
        .single()

      if (!profile?.is_admin) {
        navigate('/login')
        return
      }

      setAuthorized(true)
    }

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_OUT' || !session) {
          navigate('/login')
          return
        }

        const { data: profile } = await supabase
          .from('profiles')
          .select('is_admin')
          .eq('id', session.user.id)
          .single()

        if (!profile?.is_admin) {
          navigate('/login')
          return
        }

        setAuthorized(true)
      }
    )

    checkAdmin()

    return () => subscription.unsubscribe()
  }, [navigate])

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <p className="text-zinc-500">Verifying access...</p>
      </div>
    )
  }

  return <>{children}</>
}