import { Link } from 'react-router-dom'
import { ArrowLeft, ArrowRight, Clock3, Facebook, Linkedin, MessageCircle } from 'lucide-react'
import BlogCard from './BlogCard'

export default function BlogDetail({ post, relatedPosts, onInquiry }) {
  const articleUrl=encodeURIComponent(`${window.location.origin}/blog/${post.slug}`)
  const shareText=encodeURIComponent(post.title)

  return <article className="blog-detail">
    <header className="article-hero">
      <img src={post.image} alt={post.imageAlt}/>
      <div className="article-hero-overlay"/>
      <div className="container article-hero-content reveal">
        <Link className="article-back" to="/blog"><ArrowLeft size={17}/> Back to Blog</Link>
        <span className="article-category">{post.category}</span>
        <h1>{post.title}</h1>
        <div className="article-meta"><span>By {post.author}</span><time>{post.date}</time><span><Clock3 size={15}/>{post.readTime}</span></div>
      </div>
    </header>

    <div className="container article-layout">
      <div className="article-share" aria-label="Share this article">
        <span>Share</span>
        <a href={`https://www.facebook.com/sharer/sharer.php?u=${articleUrl}`} target="_blank" rel="noreferrer" aria-label="Share on Facebook"><Facebook size={17}/></a>
        <a href={`https://www.linkedin.com/sharing/share-offsite/?url=${articleUrl}`} target="_blank" rel="noreferrer" aria-label="Share on LinkedIn"><Linkedin size={17}/></a>
        <a href={`https://wa.me/?text=${shareText}%20${articleUrl}`} target="_blank" rel="noreferrer" aria-label="Share on WhatsApp"><MessageCircle size={17}/></a>
      </div>
      <div className="article-content">
        <p className="article-lead">{post.excerpt}</p>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
        <p>Thoughtful planning turns a promising itinerary into a journey that feels effortless. The Omicron Journeys team can help shape the route, choose suitable transport and bring the details together.</p>
      </div>
    </div>

    <section className="section article-related">
      <div className="container">
        <div className="section-head"><div><div className="eyebrow">Continue exploring</div><h2 className="section-title">Related <span className="accent">stories.</span></h2></div><Link className="btn btn-ghost" to="/blog">View all stories <ArrowRight size={17}/></Link></div>
        <div className="blog-grid">{relatedPosts.map(item=><BlogCard key={item.slug} post={item}/>)}</div>
      </div>
    </section>

    <section className="article-cta"><div className="container article-cta-inner"><div><div className="eyebrow">Travel with Omicron</div><h2>Ready to turn inspiration into a journey?</h2></div><button className="btn btn-primary" onClick={()=>onInquiry(null,'Tour Packages')}>Send an Enquiry <ArrowRight size={17}/></button></div></section>
  </article>
}
