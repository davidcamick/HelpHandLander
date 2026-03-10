import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/clerk-react'
import { adminFetch } from './api'
import { Trash2, Star, AlertTriangle } from 'lucide-react'

export default function DashboardReviews() {
  const { getToken } = useAuth()
  const [reviews, setReviews] = useState([])
  const [maxRating, setMaxRating] = useState(1)
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [error, setError] = useState(null)

  const load = async () => {
    setLoading(true)
    try {
      const token = await getToken()
      const result = await adminFetch(`/admin/reviews/flagged?maxRating=${maxRating}`, { token })
      setReviews(Array.isArray(result) ? result : result.reviews || [])
    } catch (e) {
      console.error(e)
      setReviews([])
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [maxRating])

  const handleDelete = async (reviewId) => {
    if (!confirm('Delete this review? The user\'s rating will be recalculated.')) return
    setDeleting(reviewId)
    try {
      const token = await getToken()
      await adminFetch(`/admin/reviews/${reviewId}`, { method: 'DELETE', token })
      setReviews(reviews.filter((r) => r.id !== reviewId))
    } catch (e) {
      alert('Failed to delete review')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Flagged Reviews</h1>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Max Rating:</span>
          <select
            value={maxRating}
            onChange={(e) => setMaxRating(Number(e.target.value))}
            className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm"
          >
            <option value={1}>1 ⭐ only</option>
            <option value={2}>≤ 2 ⭐</option>
            <option value={3}>≤ 3 ⭐</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
          <p className="text-sm text-red-700 font-medium">Failed to load reviews</p>
          <p className="text-xs text-red-500 mt-1">{error}</p>
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-100 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : !reviews.length && !error ? (
        <div className="text-center py-16">
          <AlertTriangle className="w-8 h-8 text-green-400 mx-auto mb-2" />
          <p className="text-gray-400">No flagged reviews — looking good!</p>
        </div>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-gray-400">{reviews.length} review{reviews.length !== 1 ? 's' : ''} flagged</p>
          {reviews.map((review) => (
            <div key={review.id} className="bg-white rounded-xl border border-red-100 p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-bold text-red-600">
                      {'⭐'.repeat(review.rating)} ({review.rating}/5)
                    </span>
                    <span className="text-xs text-gray-400">{new Date(review.createdAt).toLocaleDateString()}</span>
                  </div>
                  {review.comment ? (
                    <p className="text-sm text-gray-700 mb-2">{review.comment}</p>
                  ) : (
                    <p className="text-sm text-gray-400 italic mb-2">No comment</p>
                  )}
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      <span className="text-gray-400">From:</span>{' '}
                      <span className="font-medium">{review.reviewer?.firstName} {review.reviewer?.lastName}</span>
                    </span>
                    <span>
                      <span className="text-gray-400">To:</span>{' '}
                      <span className="font-medium">{review.reviewee?.firstName} {review.reviewee?.lastName}</span>
                    </span>
                    {review.job && (
                      <span>
                        <span className="text-gray-400">Job:</span>{' '}
                        <span className="font-medium">{review.job.title}</span>
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(review.id)}
                  disabled={deleting === review.id}
                  className="ml-4 p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-40"
                  title="Delete review"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
