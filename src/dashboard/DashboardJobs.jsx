import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { adminFetch } from './api'
import { Trash2, Briefcase } from 'lucide-react'

const STATUS_OPTIONS = ['ALL', 'OPEN', 'ACCEPTED', 'COMPLETED', 'CANCELLED']

export default function DashboardJobs() {
  const { getToken } = useAuth()
  const [jobs, setJobs] = useState([])
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const params = status !== 'ALL' ? `?status=${status}` : ''
      const result = await adminFetch(`/admin/jobs${params}`, { token })
      setJobs(result)
    } catch (e) {
      console.error(e)
      setJobs([])
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [status])

  const handleDelete = async (jobId) => {
    if (!confirm('Delete this job? This cannot be undone.')) return
    setDeleting(jobId)
    try {
      const token = await getToken()
      await adminFetch(`/admin/jobs/${jobId}`, { method: 'DELETE', token })
      setJobs(jobs.filter((j) => j.id !== jobId))
    } catch (e) {
      alert('Failed to delete job')
    } finally {
      setDeleting(null)
    }
  }

  const categoryLabel = (cat) => cat.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Jobs</h1>

      {/* Status Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {STATUS_OPTIONS.map((s) => (
          <button
            key={s}
            onClick={() => setStatus(s)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap border transition ${
              status === s
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700 font-medium">Failed to load jobs</p>
          <p className="text-xs text-red-500 mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !jobs.length && !error ? (
        <div className="text-center py-16">
          <Briefcase className="w-8 h-8 text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400">No jobs found</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 font-medium text-gray-500">Job</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Category</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Poster</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Pay</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Status</th>
                <th className="text-left px-4 py-3 font-medium text-gray-500">Reports</th>
                <th className="px-4 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.id} className="border-b border-gray-100 hover:bg-gray-50 transition">
                  <td className="px-4 py-3">
                    <p className="font-medium">{job.title}</p>
                    <p className="text-xs text-gray-400 line-clamp-1">{job.description}</p>
                  </td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-600">
                      {categoryLabel(job.category)}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {job.poster?.firstName} {job.poster?.lastName}
                  </td>
                  <td className="px-4 py-3 font-medium">${job.pay}</td>
                  <td className="px-4 py-3">
                    <JobStatusBadge status={job.status} />
                  </td>
                  <td className="px-4 py-3">
                    {job._count?.reports > 0 ? (
                      <span className="text-red-600 font-medium">{job._count.reports}</span>
                    ) : (
                      <span className="text-gray-300">0</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => handleDelete(job.id)}
                      disabled={deleting === job.id}
                      className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                      title="Delete job"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function JobStatusBadge({ status }) {
  const map = {
    OPEN: 'bg-green-50 text-green-700',
    ACCEPTED: 'bg-blue-50 text-blue-700',
    COMPLETED: 'bg-gray-100 text-gray-600',
    CANCELLED: 'bg-red-50 text-red-600',
  }
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${map[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}
