import { publicBlogPosts } from '../_blogData.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  return res.status(200).json({ ok: true, blogs: publicBlogPosts })
}
