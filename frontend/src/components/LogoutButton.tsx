import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { Button } from './ui/button'

export default function LogoutButton() {
  const navigate = useNavigate()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/login')
  }

  return (
    <Button variant="outline" onClick={handleLogout}>
      Logout
    </Button>
  )
}