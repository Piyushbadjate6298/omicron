import { ArrowUpRight, Play, Sparkles } from 'lucide-react'
import './Hero.css'

export default function Hero({ onInquiry }){
 return <section className="hero"><div className="hero-image"/><div className="hero-overlay"/><div className="container hero-inner">
   <div className="hero-copy reveal"><div className="eyebrow"><Sparkles size={15}/> Curated journeys. Reliable vehicles.</div><h1>Travel <em>better.</em><br/>Arrive with <span>confidence.</span></h1><p>Premium rentals across hatchbacks, sedans, SUVs, tempo travellers, buses, luxury cars and self-drive vehicles — with a simple, human booking experience.</p><div className="hero-actions"><button className="btn btn-primary" onClick={onInquiry}>Start an inquiry <ArrowUpRight size={18}/></button><a className="btn btn-ghost" href="#fleet"><Play size={16}/> Explore fleet</a></div></div>
   <div className="hero-panel reveal delay-2"><div className="eyebrow">Popular requests</div><div className="hero-panel-title">From airport pickups to group travel.</div><div className="mini-grid"><span>Airport rides</span><span>Outstation</span><span>City travel</span><span>Hotels & events</span></div><div className="hero-panel-foot"><span>Call the booking desk</span><a href="tel:+919322115828">+91 93221 15828</a></div></div>
 </div><div className="hero-bottom container"><div><strong>20,000+</strong><span>customers</span></div><div><strong>1,400+</strong><span>tours completed</span></div><div><strong>24×7</strong><span>support</span></div></div></section>
}
