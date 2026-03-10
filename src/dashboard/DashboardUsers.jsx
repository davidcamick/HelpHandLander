import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { Link, useSearchParams } from 'react-router-dom'
import { adminFetch } from './api'
import { Search, Ban, Shield, ChevronRight } from 'lucide-react'

export default function DashboardUsers() {
  const { getToken } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams()
  const [data, setData] = useState(null)
  const [search, setSearch] = useState('')
  const [role, setRole] = useState('')
  const [flagged, setFlagged] = useState(searchParams.get('flagged') === 'true')
  const [loading, setLoading] = useState(true)

  const load = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const params = new URLSearchParams()
      if (search) params.set('search', search)
      if (role) params.set('role', role)
      if (flagged) params.set('flagged', 'true')
      const result = await adminFetch(`/admin/users?${params}`, { token })
      setData(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [role, flagged])

  const handleSearch = (e) => {
    e.preventDefault()
    load()
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-6">
        <form onSubmit={handleSearch} className="flex-1 min-w-[200px]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
            />
          </div>
        </form>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm"
        >
          <option value="">All Roles</option>
          <option value="STUDENT">Students</option>
          <option value="POSTER">Posters</option>
        </select>
        <button
          onClick={() => setFlagged(!flagged)}
          className={`px-4 py-2.5 rounded-xl text-sm font-medium border transition ${
            flagged
              ? 'bg-red-50 border-red-200 text-red-700'
              : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
          }`}
        >
          ⚠️ Flagged Only
        </button>
      </div>

      {loading ? (
        <TableSkeleton />
      ) : !data?.users?.length ? (
        <p className="text-gray-400 text-center py-12">No users found</p>
      ) : (
        <>
          <p className="text-sm text-gray-400 mb-3">{data.total} user{data.total !== 1 ? 's' : ''}</p>
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="text-left px-4 py-3 font-medium text-gray-500">User</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Role</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Rating</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Reports</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {data.users.map((user) => (
                  <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        {user.profileImageUrl ? (
                          <img src={user.profileImageUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-400">
                            {user.firstName?.[0]}{user.lastName?.[0]}
                          </div>
                        )}
                        <div>
                          <p className="font-medium">{user.firstName} {user.lastName}</p>
                          <p className="text-xs text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded-md text-xs font-medium ${
                        user.role === 'STUDENT' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={user.avgRating <= 2.5 && user.reviewCount >= 2 ? 'text-red-600 font-semibold' : ''}>
                        {user.reviewCount > 0 ? `${user.avgRating.toFixed(1)} ⭐` : '—'}
                      </span>
                      {user.reviewCount > 0 && (
                        <span className="text-xs text-gray-400 ml-1">({user.reviewCount})</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user._count.reportsReceived > 0 ? (
                        <span className="text-red-600 font-medium">{user._count.reportsReceived}</span>
                      ) : (
                        <span className="text-gray-300">0</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {user.isBanned ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-xs font-medium">
                          <Ban className="w-3 h-3" /> Banned
                        </span>
                      ) : user.isVerified ? (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-xs font-medium">
                          <Shield className="w-3 h-3" /> Verified
                        </span>
                      ) : (
                        <span className="text-gray-400 text-xs">Active</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link to={`/dashboard/users/${user.id}`} className="text-blue-600 hover:text-blue-800">
                        <ChevronRight className="w-4 h-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="h-14 bg-gray-100 rounded-xl animate-pulse" />
      ))}
    </div>
  )
}
