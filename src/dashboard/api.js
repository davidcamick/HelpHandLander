const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

export async function adminFetch(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  let res
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    if (err.message.includes('Failed to fetch') || err.name === 'TypeError') {
      throw new Error('Network error — the backend may have a CORS issue or is unreachable. Check Railway CORS config.')
    }
    throw err
  }

  let json
  try {
    const text = await res.text()
    console.log(`[adminFetch] ${method} ${path} → ${res.status}`, text.slice(0, 500))
    json = JSON.parse(text)
  } catch (parseErr) {
    throw new Error(`Server returned non-JSON response (HTTP ${res.status})`)
  }
  if (!json.success) throw new Error(json.error || `Request failed (HTTP ${res.status})`)
  return json.data
}
