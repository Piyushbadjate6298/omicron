import jwt from 'jsonwebtoken'
import { publicBlogPosts } from '../_blogData.js'

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret123'

function verifyAuth(req) {
  const auth = req.headers.authorization || ''
  const token = auth.split(' ')[1]
  if (!token) return false
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export default async function handler(req, res) {
  if (!verifyAuth(req)) {
    return res.status(401).json({ ok: false, message: 'Unauthorized' })
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, blogs: publicBlogPosts })
  }

  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'DELETE') {
    return res.status(200).json({ ok: true, message: 'Saved successfully' })
  }

  return res.status(405).json({ ok: false, message: 'Method not allowed' })
}
