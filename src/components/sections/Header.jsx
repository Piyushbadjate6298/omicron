import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { Menu, X, Phone, ChevronDown } from 'lucide-react'
import './Header.css'

const logoImg = '/brand/omicron-journeys-transparent-v2.png'

export default function Header({ onInquiry }){
 const [open,setOpen]=useState(false)
 const {pathname}=useLocation()
 const isHome=pathname==='/'
 useEffect(()=>setOpen(false),[pathname])
 useEffect(() => {
   if (open) document.body.style.overflow = 'hidden';
   else document.body.style.overflow = '';
   const closeOnEscape = event => { if (event.key === 'Escape') setOpen(false) }
   window.addEventListener('keydown', closeOnEscape)
   return () => { document.body.style.overflow = ''; window.removeEventListener('keydown', closeOnEscape) };
 }, [open])
 const links=[['/','Home'],['/fleet','Fleet'],['/services','Services'],['/luxury','Luxury'],['/blog','Blog'],['/about','About'],['/gallery','Gallery'],['/contact','Contact']]
 return <>
  <div className="top-strip"><div className="container top-inner"><span>Premium mobility in Chhatrapati Sambhajinagar & beyond</span><div><a href="mailto:info@omicronjourneys.com">info@omicronjourneys.com</a><a href="tel:+919322115828">+91 93221 15828</a><a href="tel:+917620020040">+91 76200 20040</a></div></div></div>
  <header className={isHome?'site-header site-header-home':'site-header'}><div className="container nav-inner">
   <Link className="brand" to="/" onClick={()=>setOpen(false)}><img src={logoImg} alt="Omicron Journeys" className="brand-logo-img"/></Link>
   <nav id="primary-navigation" aria-label="Main navigation" className={open?'nav-mobile open':'nav-mobile'}>{links.map(([to,label])=><NavLink key={to} to={to} className={({isActive})=>isActive?'active':''} onClick={()=>setOpen(false)}>{label}{label==='Fleet'&&<ChevronDown size={14}/>}</NavLink>)}<button className="btn btn-primary nav-cta" onClick={()=>{setOpen(false);onInquiry()}}>Plan a Journey</button></nav>
   <button type="button" className="mobile-toggle" onClick={()=>setOpen(!open)} aria-label={open?'Close navigation':'Open navigation'} aria-expanded={open} aria-controls="primary-navigation">{open?<X/>:<Menu/>}</button>
   <a className="desktop-phone" href="tel:+919322115828"><Phone size={17}/>Call now</a>
  </div></header>
 </>
}
