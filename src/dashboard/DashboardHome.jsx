import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Link } from 'react-router-dom'
import { adminFetch } from './api'
import { Users, Briefcase, Star, Flag, AlertTriangle, Ban } from 'lucide-react'

export default function DashboardHome() {
  const { getToken } = useAuth()
  const [stats, setStats] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const token = await getToken()
        const data = await adminFetch('/admin/dashboard', { token })
        setStats(data)
      } catch (e) {
        setError(e.message)
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  if (loading) return <LoadingSkeleton />
  if (error) return <ErrorBanner message={error} />

  const cards = [
    { label: 'Total Users', value: stats.users.total, icon: Users, color: 'blue', link: '/dashboard/users' },
    { label: 'Students', value: stats.users.students, icon: Users, color: 'green' },
    { label: 'Posters', value: stats.users.posters, icon: Users, color: 'purple' },
    { label: 'Banned', value: stats.users.banned, icon: Ban, color: 'red', link: '/dashboard/users?flagged=true' },
    { label: 'Total Jobs', value: stats.jobs.total, icon: Briefcase, color: 'blue', link: '/dashboard/jobs' },
    { label: 'Open Jobs', value: stats.jobs.open, icon: Briefcase, color: 'green' },
    { label: 'Completed', value: stats.jobs.completed, icon: Briefcase, color: 'gray' },
    { label: 'Reviews', value: stats.reviews.total, icon: Star, color: 'yellow' },
    { label: 'Flagged Reviews', value: stats.reviews.flagged, icon: AlertTriangle, color: 'orange', link: '/dashboard/reviews' },
    { label: 'Pending Reports', value: stats.reports.pending, icon: Flag, color: 'red', link: '/dashboard/reports' },
    { label: 'Total Reports', value: stats.reports.total, icon: Flag, color: 'gray' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {cards.map(({ label, value, icon: Icon, color, link }) => {
          const colorMap = {
            blue: 'bg-blue-50 text-blue-600',
            green: 'bg-green-50 text-green-600',
            purple: 'bg-purple-50 text-purple-600',
            red: 'bg-red-50 text-red-600',
            yellow: 'bg-yellow-50 text-yellow-600',
            orange: 'bg-orange-50 text-orange-600',
            gray: 'bg-gray-50 text-gray-500',
          }
          const card = (
            <div className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition">
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 rounded-lg ${colorMap[color]}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {value > 0 && color === 'red' && (
                  <span className="w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse" />
                )}
              </div>
              <p className="text-2xl font-bold">{value}</p>
              <p className="text-sm text-gray-500">{label}</p>
            </div>
          )
          return link ? (
            <Link key={label} to={link}>{card}</Link>
          ) : (
            <div key={label}>{card}</div>
          )
        })}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div>
      <div className="h-8 w-48 bg-gray-200 rounded mb-6 animate-pulse" />
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
            <div className="w-10 h-10 bg-gray-100 rounded-lg mb-3" />
            <div className="h-8 w-16 bg-gray-100 rounded mb-1" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
          </div>
        ))}
      </div>
    </div>
  )
}

function ErrorBanner({ message }) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
      <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-2" />
      <p className="font-semibold text-red-700">Failed to load dashboard</p>
      <p className="text-sm text-red-500 mt-1">{message}</p>
      <p className="text-xs text-gray-400 mt-3">Make sure you're signed in with an admin account and the API is running.</p>
    </div>
  )
}
