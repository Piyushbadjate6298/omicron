import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/sections/Header'
import Footer from './components/sections/Footer'
import InquiryModal from './components/ui/InquiryModal'
import Home from './pages/Home/Home'
import Fleet from './pages/Fleet/Fleet'
import Services from './pages/Services/Services'
import Luxury from './pages/Luxury/Luxury'
import SelfDrive from './pages/SelfDrive/SelfDrive'
import About from './pages/About/About'
import Gallery from './pages/Gallery/Gallery'
import Contact from './pages/Contact/Contact'

export default function App(){
 const [inquiry,setInquiry]=useState({open:false,vehicle:null,service:'Vehicle Rental'})
 const onInquiry=(vehicle=null,service='Vehicle Rental')=>setInquiry({open:true,vehicle,service})
 return <div className="app-shell"><Header onInquiry={()=>onInquiry()}/><main><Routes>
   <Route path="/" element={<Home onInquiry={onInquiry}/>}/>
   <Route path="/fleet" element={<Fleet onInquiry={onInquiry}/>}/>
   <Route path="/services" element={<Services onInquiry={onInquiry}/>}/>
   <Route path="/luxury" element={<Luxury onInquiry={onInquiry}/>}/>
   <Route path="/self-drive" element={<SelfDrive onInquiry={onInquiry}/>}/>
   <Route path="/about" element={<About onInquiry={onInquiry}/>}/>
   <Route path="/gallery" element={<Gallery onInquiry={onInquiry}/>}/>
   <Route path="/contact" element={<Contact onInquiry={onInquiry}/>}/>
 </Routes></main><Footer/><InquiryModal open={inquiry.open} onClose={()=>setInquiry({...inquiry,open:false})} vehicle={inquiry.vehicle} initialService={inquiry.service}/><a className="floating-wa" href="https://wa.me/919322115828?text=Hello!%20I%27d%20like%20to%20make%20an%20inquiry%20about%20booking%20a%20journey%20with%20Omicron%20Journeys.%20Could%20you%20assist%20me%3F" target="_blank" rel="noreferrer">WA</a><a className="floating-call" href="tel:+919322115828">☎</a></div>
}
