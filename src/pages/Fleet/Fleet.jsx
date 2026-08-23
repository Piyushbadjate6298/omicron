import FleetShowcase from '../../components/sections/FleetShowcase'
import './Fleet.css'
export default function Fleet({onInquiry}){return <div className="page"><section className="page-hero"><div className="container"><div className="eyebrow">01 / Fleet</div><h1>Find the right <span>vehicle</span> for the journey.</h1><p>Browse the complete supplied inventory with capacity and rental rates. Select a category or search by vehicle name.</p></div></section><FleetShowcase onInquiry={onInquiry}/></div>}
