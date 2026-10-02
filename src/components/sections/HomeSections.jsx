import { Link } from 'react-router-dom'
import { ArrowUpRight, ArrowRight, ShieldCheck, UserCheck, CarFront, Compass, BadgeIndianRupee, Headphones, Quote, MapPin, Clock3 } from 'lucide-react'
import { homeDestinations, homePackages } from '../../data/home'
import { blogPosts } from '../../data/blog'
import BlogCard from '../blog/BlogCard'
import '../../pages/Blog/Blog.css'

export function SectionHeading({eyebrow,title,text,children}) {
 return <div className="home-section-heading"><div><div className="eyebrow">{eyebrow}</div><h2>{title}</h2>{text&&<p>{text}</p>}</div>{children}</div>
}
export function WhyOmicron() {
 const features=[[ShieldCheck,'Reliable service','A travel partner you can count on.'],[UserCheck,'Professional drivers','Experience and care at every turn.'],[CarFront,'Comfortable vehicles','The right ride for the road ahead.'],[Compass,'Customized journeys','Planned around what matters to you.'],[BadgeIndianRupee,'Transparent pricing','Clear quotes before you confirm.'],[Headphones,'Customer support','A real team, ready to help.']]
 return <section className="home-section"><div className="container"><SectionHeading eyebrow="THE OMICRON DIFFERENCE" title="Good journeys begin with trust."/><div className="home-features">{features.map(([Icon,title,text])=><article key={title}><Icon size={24}/><h3>{title}</h3><p>{text}</p></article>)}</div></div></section>
}
export function DestinationSection({onInquiry}) {
 return <section className="home-section home-soft"><div className="container"><SectionHeading eyebrow="FIND YOUR NEXT SOMEWHERE" title="Places that stay with you." text="From mountain mornings to coastal sunsets. Find your kind of escape."><a className="home-text-link" href="#packages">Discover our packages <ArrowUpRight size={18}/></a></SectionHeading><div className="home-destinations">{homeDestinations.map((place,index)=><button className="home-destination" key={place.name} onClick={()=>onInquiry(null,'Tour Packages')} aria-label={'Enquire about '+place.name}><img src={place.image} alt={place.name+' travel landscape'} loading="lazy"/><span className="home-destination-index">0{index+1}</span><span className="home-destination-copy"><strong>{place.name}</strong><small>{place.note}</small></span><ArrowUpRight className="destination-arrow" size={22}/></button>)}</div></div></section>
}
export function PackageSection({onInquiry}) {
 return <section className="home-section" id="packages"><div className="container"><SectionHeading eyebrow="LESS PLANNING. MORE LIVING." title="Your next escape starts here." text="Suggested journeys, shaped around you. Ask our team for availability and a personal quote."/><div className="home-packages">{homePackages.map(pack=><article className="home-package" key={pack.name}><img src={homeDestinations[pack.destination].image} alt={pack.name} loading="lazy"/><div><span><Clock3 size={14}/>{pack.days}</span><h3>{pack.name}</h3><p>{pack.text}</p><button className="home-text-link" onClick={()=>onInquiry(null,'Tour Packages')}>Enquire about this trip <ArrowUpRight size={17}/></button></div></article>)}</div></div></section>
}
export function LuxuryExperience({onInquiry}) {
 return <section className="home-luxury"><div className="container home-luxury-grid"><div className="home-luxury-visual"><img src="/fleet/range-rover.png" alt="Range Rover from the Omicron luxury vehicle collection" loading="lazy"/><span>THE LUXURY COLLECTION</span></div><div className="home-luxury-copy"><div className="eyebrow">ARRIVE WITH A LITTLE MORE PRESENCE</div><h2>Travel in<br/><em>premium comfort.</em></h2><p>Carefully selected luxury vehicles for business travel, celebrations and journeys that deserve something exceptional.</p><div className="home-luxury-tags"><span>Corporate travel</span><span>Weddings</span><span>Special occasions</span></div><Link className="btn btn-primary" to="/luxury">Explore Luxury Vehicles <ArrowUpRight size={18}/></Link><button className="home-light-link" onClick={()=>onInquiry(null,'Luxury Vehicles')}>Request availability <ArrowRight size={17}/></button></div></div></section>
}
export function TailoredTravel({onInquiry}) {
 return <section className="home-section"><div className="container home-tailored"><article><div className="eyebrow">MADE FOR YOU</div><h2>Your journey.<br/>Your way.</h2><p>Choose the destination, share your travel style, and let us bring your personalized itinerary to life.</p><div className="home-steps">{['Pick a destination','Share your preferences','Travel your way'].map((step,i)=><span key={step}><b>0{i+1}</b>{step}</span>)}</div><button className="btn btn-dark" onClick={()=>onInquiry(null,'Customized Domestic Tours')}>Customize My Trip <ArrowUpRight size={18}/></button></article><article className="home-group"><div className="eyebrow">BETTER, TOGETHER</div><h2>Big plans.<br/>Shared memories.</h2><p>Bring your people. We’ll help coordinate the journey—from the right vehicles to an itinerary everyone can enjoy.</p><div className="home-group-tags">{['Family & friends','Corporate teams','Educational groups','Religious groups'].map(text=><span key={text}>{text}</span>)}</div><button className="btn btn-primary" onClick={()=>onInquiry(null,'Tour Packages')}>Explore Group Packages <ArrowUpRight size={18}/></button></article></div></section>
}

export function HomeJournal() {
 return <section className="home-section"><div className="container"><SectionHeading eyebrow="THE OMICRON JOURNAL" title="Travel stories & inspiration."><Link className="home-text-link" to="/blog">View All Blogs <ArrowUpRight size={18}/></Link></SectionHeading><div className="blog-grid">{blogPosts.slice(0,3).map(post=><BlogCard key={post.slug} post={post}/>)}</div></div></section>
}
export function HomeCTA({onInquiry}) {
 return <section className="home-section home-final"><div className="container"><div className="home-final-inner"><MapPin size={30}/><div className="eyebrow">LET’S MAKE IT HAPPEN</div><h2>Ready for your<br/>next journey?</h2><p>Tell us where you want to go and let Omicron Journeys take care of the rest.</p><div><button className="btn btn-primary" onClick={()=>onInquiry()}>Send an Enquiry <ArrowUpRight size={18}/></button><a className="btn btn-ghost" href="#packages">Explore Packages <ArrowRight size={18}/></a></div></div></div></section>
}
