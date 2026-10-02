import { Link } from 'react-router-dom'
import { ArrowUpRight, Clock3 } from 'lucide-react'

export default function BlogCard({ post, compact=false }) {
  return <article className={`blog-card${compact?' compact':''}`}>
    <Link className="blog-card-image" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}>
      <img src={post.image} alt={post.imageAlt} loading="lazy"/>
      <span>{post.category}</span>
    </Link>
    <div className="blog-card-body">
      <div className="blog-meta"><time>{post.published_at ? new Date(post.published_at).toLocaleDateString() : post.date}</time></div>
      <h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3>
      {!compact&&<p>{post.excerpt}</p>}
      <Link className="blog-read-link" to={`/blog/${post.slug}`}>Read More <ArrowUpRight size={16}/></Link>
    </div>
  </article>
}
