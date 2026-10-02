import { ArrowRight, BadgeIndianRupee, CalendarCheck2, CarFront, Headphones, ShieldCheck, Smile } from 'lucide-react'
import { stats } from '../../data/fleet'
import './About.css'

const reasons = [
  { title: 'Most Affordable', text: 'We believe in making travel accessible to all. Our competitive pricing gives you excellent value and helps keep every trip budget-friendly.', icon: BadgeIndianRupee },
  { title: 'Extensive Fleets', text: 'Explore a diverse fleet of well-maintained vehicles for every need and preference, from economical rides to luxury cars for special occasions.', icon: CarFront },
  { title: 'Easy Bookings', text: 'Our user-friendly platform makes booking simple, with an effortless reservation experience designed around convenience and clarity.', icon: CalendarCheck2 },
  { title: 'Comfort And Satisfaction', text: 'With service across major Indian cities, we bring comfort and satisfaction to your doorstep and handle every travel need with care.', icon: Smile },
  { title: 'Safety & Hygiene', text: 'Your well-being comes first. Our vehicles are regularly sanitized and our skilled drivers follow high safety standards for every journey.', icon: ShieldCheck },
  { title: '24/7 Customer Support', text: 'Our support team is available whenever you need assistance, ready to answer questions and help resolve your travel concerns.', icon: Headphones },
]

export default function About({onInquiry}) {
  return <div className="page">
    <section className="page-hero about-hero"><div className="container"><div className="eyebrow">05 / About Us</div><h1>Your journey, backed by <span>comfort and care.</span></h1><p>Omicron Journeys is your one-stop destination for excellent self-drive vehicles and taxis, combining dependable service, fair pricing and a carefully maintained fleet.</p></div></section>
    <section className="section about-story"><div className="container about-grid">
      <div><div className="eyebrow">Omicron Journeys</div><h2 className="section-title">Travel made enjoyable, reliable and <span className="accent">unforgettable.</span></h2><div className="about-principles" aria-label="Our operating principles"><span>Customer service</span><span>Transparency</span><span>Experienced staff</span><span>Dependability</span></div></div>
      <div className="about-copy"><p>Introducing Omicron Journeys, your one-stop shop for excellent self-drive vehicles and taxis. We are one of India’s most vibrant and quickly expanding vehicle rental companies, operated by our primary business, Omicron Journeys Group.</p><p>Our goal is to provide the greatest service possible at the most reasonable cost—ensuring maximum comfort and helping make every journey enjoyable and unforgettable.</p><p>Our skilled drivers put your safety first, and we are dedicated to delivering excellent customer service in the vehicle-rental industry. Customer service, transparency, experienced staff and dependability guide everything we do as we work to meet every client’s needs.</p><p>From affordable travel to upscale journeys, we offer a variety of services so everyone can find an option that suits them.</p><button className="btn btn-dark" onClick={()=>onInquiry()}>Talk to Omicron <ArrowRight size={17}/></button></div>
    </div></section>
    <section className="section about-values"><div className="container"><div className="section-head"><div><div className="eyebrow">Why Choose Us?</div><h2 className="section-title">A seamless experience, <span className="accent">wherever you go.</span></h2></div><p className="section-copy">Effortless reservations on the go, backed by a team focused on value, safety and a comfortable travel experience.</p></div><div className="value-grid">{reasons.map(reason=>{const Icon=reason.icon;return <article key={reason.title}><div className="value-icon"><Icon size={23}/></div><h3>{reason.title}</h3><p>{reason.text}</p></article>})}</div></div></section>
    <section className="section about-stats dark"><div className="container"><div className="stats-inline">{stats.map(stat=><div key={stat.label}><strong>{stat.value}</strong><span>{stat.label}</span></div>)}</div></div></section>
  </div>
}
