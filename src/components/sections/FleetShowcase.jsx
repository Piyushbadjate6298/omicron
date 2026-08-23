import { useMemo, useState } from 'react'
import { ArrowRight, Gauge, Users, IndianRupee, Search } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories, fleet } from '../../data/fleet'
import './FleetShowcase.css'

export default function FleetShowcase({ onInquiry, compact=false }){
 const [active,setActive]=useState('all'); const [query,setQuery]=useState('')
 const filtered=useMemo(()=>fleet.filter(v=>(active==='all'||v.category===active)&&v.name.toLowerCase().includes(query.toLowerCase())),[active,query])
 const visible=compact?filtered.slice(0,6):filtered
 return <section className="section fleet-section" id="fleet"><div className="container">
  <div className="section-head"><div><div className="eyebrow">The Omicron fleet</div><h2 className="section-title">Choose your <span className="accent">ride.</span></h2><p className="section-copy">From everyday city cars to 50-seat buses and signature luxury vehicles, every listing is presented with capacity and the supplied rental rate.</p></div><Link className="btn btn-dark" to="/fleet">View full fleet <ArrowRight size={17}/></Link></div>
  <div className="fleet-toolbar"><div className="filters">{[{key:'all',label:'All'},...categories].map(c=><button key={c.key} className={active===c.key?'active':''} onClick={()=>setActive(c.key)}>{c.label}</button>)}</div><label className="fleet-search"><Search size={17}/><input placeholder="Search vehicle" value={query} onChange={e=>setQuery(e.target.value)}/></label></div>
  <div className="fleet-grid">{visible.map((v,i)=><article className="vehicle-card reveal" key={`${v.category}-${v.name}-${i}`}><div className="vehicle-image"><img src={v.image} alt={v.name} loading="lazy" onError={e=>{e.currentTarget.style.display='none';e.currentTarget.parentElement.classList.add('image-fallback')}}/><span>{categories.find(c=>c.key===v.category)?.label}</span><button onClick={()=>onInquiry(v)}>Book</button></div><div className="vehicle-body"><div><p className="vehicle-category">{categories.find(c=>c.key===v.category)?.eyebrow}</p><h3>{v.name}</h3></div><div className="vehicle-specs"><span><Users size={15}/>{v.capacity}</span><span><Gauge size={15}/>{v.category==='self-drive'?'Self drive':'Rental'}</span></div><div className="vehicle-foot"><div className="rate"><small>Starting</small><strong><IndianRupee size={15}/>{v.rate}</strong><small>{v.unit}</small></div><button className="text-btn" onClick={()=>onInquiry(v)}>Inquiry <ArrowRight size={16}/></button></div></div></article>)}</div>
  {visible.length===0&&<div className="empty-fleet">No vehicle matches that search. Try another name or category.</div>}
  {compact&&<div className="center-cta"><Link className="btn btn-dark" to="/fleet">See all {fleet.length} vehicles <ArrowRight size={17}/></Link></div>}
 </div></section>
}
