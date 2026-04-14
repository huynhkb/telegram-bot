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
      // 1. Get current user
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        navigate('/login')
        return
      }

      // 2. Query profiles table
      const { data: profile } = await supabase
        .from('profiles')
        .select('is_admin')
        .eq('id', user.id)
        .single()

      if (!profile?.is_admin) {
        navigate('/login')
        return
      }

      setAuthorized(true)
    }

    checkAdmin()
  }, [navigate])

  if (!authorized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Verifying access...</p>
      </div>
    )
  }

  return <>{children}</>
}