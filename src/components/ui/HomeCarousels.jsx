import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight, Clock3, MapPin } from 'lucide-react'
import { homeDestinations, homePackages } from '../../data/home'
import { blogPosts } from '../../data/blog'
import { SectionHeading } from '../sections/HomeSections'
import FocusCarousel from './FocusCarousel'

const destinationTags = [
  ['Lakes & valleys', 'Scenic stays', 'Mountain air'],
  ['Mountain roads', 'Nature', 'Adventure'],
  ['Heritage', 'Culture', 'Architecture'],
  ['Beaches', 'Leisure', 'Coastal life'],
  ['Backwaters', 'Wellness', 'Nature'],
  ['Weekend escapes', 'Heritage', 'Local discoveries'],
]

export function DestinationCarousel({ onInquiry }) {
  return <section className="home-section home-soft"><div className="container">
    <SectionHeading eyebrow="FIND YOUR NEXT SOMEWHERE" title="Places that stay with you." text="From mountain mornings to coastal sunsets. Find your kind of escape.">
      <a className="home-text-link" href="#packages">Discover our packages <ArrowUpRight size={18}/></a>
    </SectionHeading>
    <FocusCarousel items={homeDestinations} getImage={place => place.image} label="Featured travel destinations" renderItem={(place, index) => <article className="focus-carousel-card">
      <div className="focus-carousel-media"><img src={place.image} alt={`${place.name} travel landscape`} loading="lazy"/><span className="focus-carousel-badge"><MapPin size={14}/>Destination {String(index + 1).padStart(2, '0')}</span></div>
      <div className="focus-carousel-body"><div className="focus-carousel-kicker">Discover India</div><h3>{place.name}</h3><p>{place.note}. Thoughtfully planned routes, comfortable travel and enough time to enjoy the moments in between.</p><div className="focus-carousel-actions"><div className="focus-carousel-tags">{destinationTags[index].map(tag => <span key={tag}>{tag}</span>)}</div><button className="home-text-link" onClick={() => onInquiry(null, 'Tour Packages')}>Plan this journey <ArrowUpRight size={17}/></button></div></div>
    </article>}/>
  </div></section>
}

export function PackageCarousel({ onInquiry }) {
  return <section className="home-section" id="packages"><div className="container">
    <SectionHeading eyebrow="LESS PLANNING. MORE LIVING." title="Your next escape starts here." text="Suggested journeys, shaped around you. Ask our team for availability and a personal quote."/>
    <FocusCarousel className="focus-carousel-packages" items={homePackages} getImage={pack => homeDestinations[pack.destination].image} label="Featured tour packages" interval={5800} renderItem={(pack, index) => <article className="focus-carousel-card">
      <div className="focus-carousel-media"><img src={homeDestinations[pack.destination].image} alt={pack.name} loading="lazy"/><span className="focus-carousel-badge"><Clock3 size={14}/>{pack.days}</span></div>
      <div className="focus-carousel-body"><div className="focus-carousel-kicker">Curated escape {String(index + 1).padStart(2, '0')}</div><h3>{pack.name}</h3><p>{pack.text} Every itinerary can be adjusted around your dates, group and travel style.</p><div className="focus-carousel-actions"><div className="focus-carousel-tags"><span>Personalized itinerary</span><span>Comfortable travel</span></div><button className="home-text-link" onClick={() => onInquiry(null, 'Tour Packages')}>Enquire about this trip <ArrowUpRight size={17}/></button></div></div>
    </article>}/>
  </div></section>
}

export function JournalCarousel() {
  const stories = blogPosts.slice(0, 5)
  return <section className="home-section"><div className="container">
    <SectionHeading eyebrow="THE OMICRON JOURNAL" title="Travel stories & inspiration."><Link className="home-text-link" to="/blog">View All Blogs <ArrowUpRight size={18}/></Link></SectionHeading>
    <FocusCarousel className="focus-carousel-blog" items={stories} getImage={post => post.image} label="Travel stories and inspiration" interval={6200} renderItem={post => <article className="focus-carousel-card">
      <Link className="focus-carousel-media" to={`/blog/${post.slug}`} aria-label={`Read ${post.title}`}><img src={post.image} alt={post.imageAlt} loading="lazy"/><span className="focus-carousel-badge">{post.category}</span></Link>
      <div className="focus-carousel-body"><div className="focus-carousel-kicker"><span>{post.date}</span><span>•</span><span>{post.readTime}</span></div><h3><Link to={`/blog/${post.slug}`}>{post.title}</Link></h3><p>{post.excerpt}</p><div className="focus-carousel-actions"><Link className="home-text-link" to={`/blog/${post.slug}`}>Read the story <ArrowUpRight size={17}/></Link><Link className="home-text-link focus-carousel-all-link" to="/blog">All stories <ArrowRight size={17}/></Link></div></div>
    </article>}/>
  </div></section>
}
