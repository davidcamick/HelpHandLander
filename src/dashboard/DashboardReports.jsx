import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { adminFetch } from './api'
import { FileText, CheckCircle, XCircle, Clock, Eye } from 'lucide-react'

const STATUS_OPTIONS = ['ALL', 'PENDING', 'REVIEWING', 'RESOLVED', 'DISMISSED']

export default function DashboardReports() {
  const { getToken } = useAuth()
  const [reports, setReports] = useState([])
  const [status, setStatus] = useState('ALL')
  const [loading, setLoading] = useState(true)
  const [expandedId, setExpandedId] = useState(null)
  const [adminNotes, setAdminNotes] = useState({})
  const [updating, setUpdating] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const params = status !== 'ALL' ? `?status=${status}` : ''
      const result = await adminFetch(`/admin/reports${params}`, { token })
      setReports(result)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [status])

  const updateStatus = async (reportId, newStatus) => {
    setUpdating(reportId)
    try {
      const token = await getToken()
      await adminFetch(`/admin/reports/${reportId}`, {
        method: 'PATCH',
        body: { status: newStatus, adminNotes: adminNotes[reportId] || '' },
        token,
      })
      await load()
    } catch (e) {
      alert('Failed to update report')
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Reports</h1>

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

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !reports.length ? (
        <p className="text-gray-400 text-center py-12">No reports found</p>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => (
            <div key={report.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
              <div
                className="p-4 cursor-pointer hover:bg-gray-50 transition"
                onClick={() => setExpandedId(expandedId === report.id ? null : report.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <StatusBadge status={report.status} />
                      <span className="text-sm font-semibold text-gray-800">
                        {report.reason.replace(/_/g, ' ')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      <span className="font-medium">{report.reporter?.firstName} {report.reporter?.lastName}</span>
                      {' → '}
                      <span className="font-medium">{report.reported?.firstName} {report.reported?.lastName}</span>
                    </p>
                    {report.job && (
                      <p className="text-xs text-gray-400 mt-1">Job: {report.job.title}</p>
                    )}
                  </div>
                  <span className="text-xs text-gray-400">{new Date(report.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Expanded Details */}
              {expandedId === report.id && (
                <div className="border-t border-gray-100 p-4 bg-gray-50">
                  {report.description && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-1">Description</p>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                        {report.description}
                      </p>
                    </div>
                  )}
                  {report.adminNotes && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-1">Admin Notes</p>
                      <p className="text-sm text-gray-700 bg-white p-3 rounded-lg border border-gray-100">
                        {report.adminNotes}
                      </p>
                    </div>
                  )}

                  {/* Update Actions */}
                  <div className="space-y-3">
                    <div>
                      <label className="text-xs text-gray-500 mb-1 block">Add / Update Notes</label>
                      <textarea
                        rows={2}
                        value={adminNotes[report.id] ?? report.adminNotes ?? ''}
                        onChange={(e) => setAdminNotes({ ...adminNotes, [report.id]: e.target.value })}
                        placeholder="Internal notes..."
                        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {report.status !== 'REVIEWING' && (
                        <ActionBtn
                          icon={<Eye className="w-3.5 h-3.5" />}
                          label="Reviewing"
                          color="blue"
                          disabled={updating === report.id}
                          onClick={() => updateStatus(report.id, 'REVIEWING')}
                        />
                      )}
                      {report.status !== 'RESOLVED' && (
                        <ActionBtn
                          icon={<CheckCircle className="w-3.5 h-3.5" />}
                          label="Resolve"
                          color="green"
                          disabled={updating === report.id}
                          onClick={() => updateStatus(report.id, 'RESOLVED')}
                        />
                      )}
                      {report.status !== 'DISMISSED' && (
                        <ActionBtn
                          icon={<XCircle className="w-3.5 h-3.5" />}
                          label="Dismiss"
                          color="gray"
                          disabled={updating === report.id}
                          onClick={() => updateStatus(report.id, 'DISMISSED')}
                        />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const map = {
    PENDING: { bg: 'bg-amber-50 text-amber-700', icon: <Clock className="w-3 h-3" /> },
    REVIEWING: { bg: 'bg-blue-50 text-blue-700', icon: <Eye className="w-3 h-3" /> },
    RESOLVED: { bg: 'bg-green-50 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
    DISMISSED: { bg: 'bg-gray-100 text-gray-500', icon: <XCircle className="w-3 h-3" /> },
  }
  const s = map[status] || map.PENDING
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${s.bg}`}>
      {s.icon} {status}
    </span>
  )
}

function ActionBtn({ icon, label, color, disabled, onClick }) {
  const colors = {
    blue: 'bg-blue-50 text-blue-700 hover:bg-blue-100 border-blue-200',
    green: 'bg-green-50 text-green-700 hover:bg-green-100 border-green-200',
    gray: 'bg-gray-50 text-gray-600 hover:bg-gray-100 border-gray-200',
  }
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition disabled:opacity-50 ${colors[color]}`}
    >
      {icon} {label}
    </button>
  )
}
