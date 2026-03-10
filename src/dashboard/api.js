const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function adminFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  })

  const json = await res.json()
  if (!json.success) throw new Error(json.error || 'Request failed')
  return json.data
}
