import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123'
const DEFAULT_ADMIN_USER = process.env.ADMIN_USER || 'admin'
const DEFAULT_ADMIN_PASS = process.env.ADMIN_PASS || 'admin123'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  const { username, password } = req.body || {}

  if (username === DEFAULT_ADMIN_USER && password === DEFAULT_ADMIN_PASS) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' })
    return res.status(200).json({ ok: true, token })
  }

  return res.status(401).json({ ok: false, message: 'Invalid credentials' })
}
