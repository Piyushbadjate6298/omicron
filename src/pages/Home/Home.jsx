import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import Hero from '../../components/sections/Hero'
import FleetShowcase from '../../components/sections/FleetShowcase'
import ServicesGrid from '../../components/sections/ServicesGrid'
import Experience from '../../components/sections/Experience'
import Trust from '../../components/sections/Trust'
import Testimonials from '../../components/sections/Testimonials'
import './Home.css'
export default function Home({onInquiry}){return <>
 <Hero onInquiry={onInquiry}/>
 <section className="home-marquee"><div className="container"><span>HATCHBACKS</span><i/> <span>SEDANS</span><i/><span>SUVS</span><i/><span>TEMPO TRAVELLERS</span><i/><span>MINI BUSES</span><i/><span>LUXURY</span><i/><span>SELF DRIVE</span></div></section>
 <FleetShowcase onInquiry={onInquiry} compact/>
 <Experience/>
 <ServicesGrid onInquiry={onInquiry}/>
 <Trust/>
 <section className="section home-cta"><div className="container home-cta-inner"><div><div className="eyebrow">Ready when you are</div><h2 className="section-title">A better ride starts with one <span className="accent">message.</span></h2><p className="section-copy">Tell us your route, dates and preferred vehicle. We will take it from there.</p></div><div className="home-cta-actions"><button className="btn btn-primary" onClick={()=>onInquiry()}>Submit an inquiry <ArrowRight size={17}/></button><Link className="btn btn-ghost" to="/contact">Contact desk</Link></div></div></section>
 <Testimonials/>
 </>}
