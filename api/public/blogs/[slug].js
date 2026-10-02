import { publicBlogPosts } from '../../_blogData.js'

export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ ok: false, message: 'Method not allowed' })
  }

  const slug = Array.isArray(req.query.slug) ? req.query.slug[0] : req.query.slug
  const blog = publicBlogPosts.find(post => post.slug === slug)
  if (!blog) return res.status(404).json({ ok: false, message: 'Blog not found' })

  res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600')
  return res.status(200).json({ ok: true, blog })
}
