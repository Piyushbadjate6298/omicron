import { blogPosts } from '../src/data/blog.js'

const escapeHtml = value => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;')

const renderContent = post => [
  ...(post.sections || []).flatMap(section => [
    `<h2>${escapeHtml(section.heading)}</h2>`,
    ...(section.paragraphs || []).map(paragraph => `<p>${escapeHtml(paragraph)}</p>`),
  ]),
  post.quote ? `<blockquote>${escapeHtml(post.quote)}</blockquote>` : '',
].filter(Boolean).join('')

export const publicBlogPosts = blogPosts.map((post, index) => ({
  ...post,
  id: post.id || index + 1,
  published_at: post.published_at || post.date,
  content: post.content || renderContent(post),
  status: 'Published',
}))
