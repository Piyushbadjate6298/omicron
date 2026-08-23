import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import './Header.css'

export default function Header({ onInquiry }){
 const [open,setOpen]=useState(false)
 const links=[['/','Home'],['/fleet','Fleet'],['/services','Services'],['/luxury','Luxury'],['/self-drive','Self Drive'],['/about','About'],['/gallery','Gallery'],['/contact','Contact']]
 return <>
  <div className="top-strip"><div className="container top-inner"><span>Premium mobility in Aurangabad & beyond</span><div><a href="mailto:info@omicronjourneys.com">info@omicronjourneys.com</a><a href="tel:+919322115828">+91 93221 15828</a><a href="tel:+917620020040">+91 76200 20040</a></div></div></div>
  <header className="site-header"><div className="container nav-inner">
   <Link className="brand" to="/" onClick={()=>setOpen(false)}><img src="/brand/omicron-logo.png" alt="Omicron Journeys"/><span>OMI<span>CRON</span><small>JOURNEYS</small></span></Link>
   <nav className={open?'nav-mobile open':'nav-mobile'}>{links.map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''} onClick={()=>setOpen(false)}>{label}{label==='Fleet'&&<ChevronDown size={14}/>}</NavLink>)}<button className="btn btn-primary nav-cta" onClick={()=>{setOpen(false);onInquiry()}}>Book a vehicle</button></nav>
   <button className="mobile-toggle" onClick={()=>setOpen(!open)} aria-label="Toggle navigation">{open?<X/>:<Menu/>}</button>
   <a className="desktop-phone" href="tel:+919322115828"><Phone size={17}/>Call now</a>
  </div></header>
 </>
}
