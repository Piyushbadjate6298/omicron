import { useEffect, useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock3, Mail, MapPin, Sparkles } from 'lucide-react'
import BlogCard from '../../components/blog/BlogCard'
import BlogDetail from '../../components/blog/BlogDetail'
import { blogCategories, destinations } from '../../data/blog'
import './Blog.css'

function usePageSeo(title,description) {
  useEffect(()=>{
    const previousTitle=document.title
    const meta=document.querySelector('meta[name="description"]')
    const previousDescription=meta?.getAttribute('content')
    document.title=title
    if(meta) meta.setAttribute('content',description)
    return ()=>{
      document.title=previousTitle
      if(meta&&previousDescription) meta.setAttribute('content',previousDescription)
    }
  },[title,description])
}

export default function Blog({ onInquiry }) {
  const [activeCategory,setActiveCategory]=useState('All')
  const [subscribed,setSubscribed]=useState(false)
  const [blogPosts, setBlogPosts] = useState([])
  
  useEffect(() => {
    fetch('/api/public/blogs').then(r => r.json()).then(data => {
      if (data.ok) setBlogPosts(data.blogs)
    })
  }, [])

  const featuredPost = blogPosts[0] || null
  const trendingPosts = blogPosts.slice(1, 6)

  const visiblePosts = useMemo(()=>activeCategory==='All'
    ? blogPosts.slice(1) // exclude featured
    : blogPosts.filter(post=>post.category===activeCategory),[activeCategory, blogPosts])

  usePageSeo('Travel Stories, Guides & Inspiration | Omicron Journeys','Discover India travel guides, road-trip ideas, destination inspiration and practical tips from Omicron Journeys.')

  const exploreDestination=(category)=>{
    setActiveCategory(category)
    document.getElementById('latest-articles')?.scrollIntoView({behavior:'smooth'})
  }

  if (blogPosts.length === 0) return <div style={{padding: '100px', textAlign: 'center'}}>Loading blogs...</div>;

  return <div className="blog-page">
    <section className="blog-hero" style={{'--blog-hero-image':`url(${featuredPost?.image || ''})`}}>
      <div className="blog-hero-overlay"/>
      <div className="container blog-hero-content reveal">
        <div className="eyebrow"><Sparkles size={15}/> The Omicron Journal</div>
        <h1>Travel Stories,<br/><span>Guides & Inspiration</span></h1>
        <p>Discover beautiful destinations, practical travel tips, road-trip ideas, and inspiring journeys.</p>
        <a className="btn btn-primary" href="#latest-articles">Explore stories <ArrowRight size={17}/></a>
      </div>
      <div className="blog-hero-note"><MapPin size={17}/><span>Ideas for journeys across India</span></div>
    </section>

    <section className="section featured-story-section">
      <div className="container">
        <div className="section-head"><div><div className="eyebrow">Editor’s pick</div><h2 className="section-title">Featured <span className="accent">story.</span></h2></div></div>
        <article className="featured-story">
          <Link className="featured-story-image" to={'/blog/' + featuredPost.slug}><img src={featuredPost.image} alt={featuredPost.title}/></Link>
          <div className="featured-story-body">
            <span className="article-category">{featuredPost.category}</span>
            <h2><Link to={'/blog/' + featuredPost.slug}>{featuredPost.title}</Link></h2>
            <p>{featuredPost.excerpt}</p>
            <div className="blog-meta"><time>{new Date(featuredPost.published_at).toLocaleDateString()}</time></div>
            <Link className="btn btn-dark" to={'/blog/' + featuredPost.slug}>Read More <ArrowUpRight size={17}/></Link>
          </div>
        </article>
      </div>
    </section>

    <section className="section latest-section" id="latest-articles">
      <div className="container">
        <div className="section-head"><div><div className="eyebrow">Fresh from the journal</div><h2 className="section-title">Latest <span className="accent">articles.</span></h2></div><p className="section-copy">Practical ideas, thoughtful routes and destination stories created to make your next journey better.</p></div>
        <div className="category-filters" role="group" aria-label="Filter articles by category">{blogCategories.map(category=><button key={category} className={activeCategory===category?'active':''} onClick={()=>setActiveCategory(category)}>{category}</button>)}</div>
        {visiblePosts.length?<div className="blog-grid">{visiblePosts.map(post=><BlogCard key={post.slug} post={post}/>)}</div>:<div className="blog-empty">More stories in this category are coming soon.</div>}
      </div>
    </section>

    {trendingPosts.length > 0 && (
      <section className="section trending-section dark">
        <div className="container">
          <div className="section-head"><div><div className="eyebrow">Most read</div><h2 className="section-title">Trending Travel <span>Stories.</span></h2></div><p className="section-copy">The routes and destinations inspiring travellers right now.</p></div>
          <div className="trending-layout">
            <article className="trending-lead"><img src={trendingPosts[0].image} alt={trendingPosts[0].title} loading="lazy"/><div><span>{trendingPosts[0].category}</span><h3>{trendingPosts[0].title}</h3><Link to={'/blog/' + trendingPosts[0].slug}>Read the story <ArrowRight size={16}/></Link></div></article>
            <div className="trending-list">{trendingPosts.slice(1).map((post,index)=><Link to={'/blog/' + post.slug} key={post.slug}><strong>0{index+2}</strong><span><small>{post.category}</small><b>{post.title}</b></span><ArrowUpRight size={18}/></Link>)}</div>
          </div>
        </div>
      </section>
    )}

    <section className="section destination-section">
      <div className="container">
        <div className="section-head"><div><div className="eyebrow">Where to next?</div><h2 className="section-title">Destination <span className="accent">inspiration.</span></h2></div><p className="section-copy">Six distinct corners of India, each with a different reason to start planning.</p></div>
        <div className="destination-grid">{destinations.map(destination=><article key={destination.name}><img src={destination.image} alt={'Travel inspiration for ' + destination.name} loading="lazy"/><div><h3>{destination.name}</h3><p>{destination.description}</p><button onClick={()=>exploreDestination(destination.category)}>Explore Stories <ArrowRight size={15}/></button></div></article>)}</div>
      </div>
    </section>

    <section className="section newsletter-section">
      <div className="container newsletter-inner"><div><div className="eyebrow"><Mail size={15}/> Travel notes</div><h2>Get Travel Inspiration<br/>in Your Inbox</h2><p>Travel guides, destination ideas and exclusive travel stories delivered directly to you.</p></div>{subscribed?<div className="newsletter-success">Thank you—your next dose of travel inspiration is on its way.</div>:<form onSubmit={event=>{event.preventDefault();setSubscribed(true)}}><label htmlFor="newsletter-email">Email address</label><div><input id="newsletter-email" type="email" required placeholder="you@example.com"/><button className="btn btn-primary">Subscribe <ArrowRight size={17}/></button></div></form>}</div>
    </section>

    <section className="blog-bottom-cta"><div className="container blog-bottom-cta-inner"><div><div className="eyebrow">Your journey starts here</div><h2>Ready to Plan Your Next Journey?</h2></div><div><Link className="btn btn-ghost" to="/services">Explore Tour Packages</Link><button className="btn btn-primary" onClick={()=>onInquiry(null,'Tour Packages')}>Send an Enquiry <ArrowRight size={17}/></button></div></div></section>
  </div>
}

export function BlogArticlePage({ onInquiry }) {
  const {slug}=useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/public/blogs/' + slug).then(r => r.json()).then(data => {
      if (data.ok) setPost(data.blog)
      setLoading(false)
      fetch('/api/public/blogs').then(r => r.json()).then(d => {
        if (d.ok) setRelated(d.blogs.filter(b => b.slug !== slug).slice(0, 3))
      })
    })
  }, [slug])

  usePageSeo(post ? post.title + ' | Omicron Journeys' : 'Story Not Found | Omicron Journeys', post?.excerpt||'Explore travel stories from Omicron Journeys.')

  if (loading) return <div style={{padding: '100px', textAlign: 'center'}}>Loading...</div>;

  if(!post) return <section className="section blog-not-found"><div className="container"><div className="eyebrow">404 / Journal</div><h1>That story has moved on.</h1><p>Explore the latest guides and travel inspiration in the Omicron Journal.</p><Link className="btn btn-dark" to="/blog">Back to Blog</Link></div></section>

  return <BlogDetail post={post} relatedPosts={related} onInquiry={onInquiry}/>
}
