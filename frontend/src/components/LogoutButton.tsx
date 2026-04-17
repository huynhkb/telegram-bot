import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export default function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <button
      onClick={handleLogout}
      className="text-xs font-medium text-zinc-500 hover:text-zinc-300 border border-zinc-800 hover:border-zinc-700 rounded-lg px-3 py-1.5 transition-colors"
    >
      Logout
    </button>
  )
}
