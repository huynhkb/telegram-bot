import LogoutButton from '../components/LogoutButton'

export default function DashboardPage() {
  return (
    <div className="min-h-screen p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <LogoutButton />
      </div>
      <p className="text-gray-500">Dashboard coming in Phase 3...</p>
    </div>
  )
}