import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { useParams, useNavigate } from 'react-router-dom'
import { adminFetch } from './api'
import { ArrowLeft, Ban, ShieldCheck, Star, AlertTriangle, FileText } from 'lucide-react'

export default function DashboardUserDetail() {
  const { id } = useParams()
  const { getToken } = useAuth()
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState(false)
  const [banReason, setBanReason] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const result = await adminFetch(`/admin/users/${id}`, { token })
      setUser(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [id])

  const handleBan = async () => {
    if (!confirm('Are you sure you want to ban this user?')) return
    setActionLoading(true)
    try {
      const token = await getToken()
      await adminFetch(`/admin/users/${id}/ban`, {
        method: 'POST',
        body: { reason: banReason || 'Banned by admin' },
        token,
      })
      await load()
      setBanReason('')
    } catch (e) {
      alert('Failed to ban user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleUnban = async () => {
    setActionLoading(true)
    try {
      const token = await getToken()
      await adminFetch(`/admin/users/${id}/unban`, { method: 'POST', token })
      await load()
    } catch (e) {
      alert('Failed to unban user')
    } finally {
      setActionLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-gray-100 rounded-lg animate-pulse" />
        <div className="h-48 bg-gray-100 rounded-xl animate-pulse" />
        <div className="h-64 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    )
  }

  if (!user) return <p className="text-gray-400">User not found</p>

  const isFlagged = user.avgRating <= 2.5 && user.reviewCount >= 2

  return (
    <div>
      <button onClick={() => navigate('/dashboard/users')} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800 mb-4 transition">
        <ArrowLeft className="w-4 h-4" /> Back to Users
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            {user.profileImageUrl ? (
              <img src={user.profileImageUrl} alt="" className="w-16 h-16 rounded-full object-cover" />
            ) : (
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-400">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
            )}
            <div>
              <h1 className="text-xl font-bold">{user.firstName} {user.lastName}</h1>
              <p className="text-gray-500">{user.email}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  user.role === 'STUDENT' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                }`}>{user.role}</span>
                {isFlagged && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-amber-50 text-amber-700 inline-flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Low Rating
                  </span>
                )}
                {user.isBanned && (
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-700 inline-flex items-center gap-1">
                    <Ban className="w-3 h-3" /> Banned
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
          <StatBox label="Rating" value={user.reviewCount > 0 ? `${user.avgRating.toFixed(1)} ⭐` : 'N/A'} />
          <StatBox label="Reviews" value={user.reviewCount} />
          <StatBox label="Reports Received" value={user._count?.reportsReceived ?? 0} warn={user._count?.reportsReceived > 0} />
          <StatBox label="Jobs" value={(user._count?.postedJobs ?? 0) + (user._count?.acceptedJobs ?? 0)} />
        </div>
      </div>

      {/* Ban / Unban */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold mb-3">Moderation</h2>
        {user.isBanned ? (
          <div>
            <p className="text-sm text-gray-500 mb-2">
              Banned{user.banReason ? `: ${user.banReason}` : ''}
            </p>
            <button
              onClick={handleUnban}
              disabled={actionLoading}
              className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 disabled:opacity-50 transition inline-flex items-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" /> Unban User
            </button>
          </div>
        ) : (
          <div className="flex flex-wrap gap-3 items-end">
            <div className="flex-1 min-w-[200px]">
              <label className="text-xs text-gray-500 mb-1 block">Ban Reason</label>
              <input
                value={banReason}
                onChange={(e) => setBanReason(e.target.value)}
                placeholder="e.g. Repeated violations..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-red-300"
              />
            </div>
            <button
              onClick={handleBan}
              disabled={actionLoading}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 disabled:opacity-50 transition inline-flex items-center gap-2"
            >
              <Ban className="w-4 h-4" /> Ban User
            </button>
          </div>
        )}
      </div>

      {/* Reviews Received */}
      {user.reviewsReceived?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <Star className="w-4 h-4" /> Reviews Received ({user.reviewsReceived.length})
          </h2>
          <div className="space-y-3">
            {user.reviewsReceived.map((r) => (
              <div key={r.id} className={`p-3 rounded-lg border ${r.rating <= 1 ? 'border-red-200 bg-red-50' : 'border-gray-100'}`}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium">
                    {'⭐'.repeat(r.rating)} ({r.rating}/5)
                  </span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                <p className="text-xs text-gray-400 mt-1">From: {r.reviewer?.firstName} {r.reviewer?.lastName}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Reports Received */}
      {user.reportsReceived?.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" /> Reports Received ({user.reportsReceived.length})
          </h2>
          <div className="space-y-3">
            {user.reportsReceived.map((r) => (
              <div key={r.id} className="p-3 rounded-lg border border-gray-100">
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-xs font-medium px-2 py-0.5 rounded ${statusColor(r.status)}`}>{r.status}</span>
                  <span className="text-xs text-gray-400">{new Date(r.createdAt).toLocaleDateString()}</span>
                </div>
                <p className="text-sm font-medium">{r.reason.replace(/_/g, ' ')}</p>
                {r.description && <p className="text-sm text-gray-600 mt-1">{r.description}</p>}
                <p className="text-xs text-gray-400 mt-1">From: {r.reporter?.firstName} {r.reporter?.lastName}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function StatBox({ label, value, warn }) {
  return (
    <div className="bg-gray-50 rounded-lg p-3">
      <p className="text-xs text-gray-400">{label}</p>
      <p className={`text-lg font-bold ${warn ? 'text-red-600' : ''}`}>{value}</p>
    </div>
  )
}

function statusColor(status) {
  switch (status) {
    case 'PENDING': return 'bg-amber-50 text-amber-700'
    case 'REVIEWING': return 'bg-blue-50 text-blue-700'
    case 'RESOLVED': return 'bg-green-50 text-green-700'
    case 'DISMISSED': return 'bg-gray-100 text-gray-600'
    default: return 'bg-gray-100 text-gray-600'
  }
}
