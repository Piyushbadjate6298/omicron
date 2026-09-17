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
 </Routes></main><Footer/><InquiryModal open={inquiry.open} onClose={()=>setInquiry({...inquiry,open:false})} vehicle={inquiry.vehicle} initialService={inquiry.service}/><a className="floating-wa" href="https://wa.me/919322115828?text=Hello!%20I%27d%20like%20to%20make%20an%20inquiry%20about%20booking%20a%20journey%20with%20Omicron%20Journeys.%20Could%20you%20assist%20me%3F" target="_blank" rel="noreferrer" aria-label="Chat on WhatsApp" title="Chat on WhatsApp"><svg width="28" height="28" viewBox="0 0 24 24" fill="none"><path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.572-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414-.074-.124-.272-.198-.57-.347z"/><path fill="currentColor" fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 2.159.684 4.159 1.849 5.803L2.5 21.5l3.827-1.31A9.956 9.956 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18c-1.782 0-3.432-.466-4.864-1.278l-.348-.198-2.583.884.887-2.531-.219-.356A7.954 7.954 0 014 12c0-4.411 3.589-8 8-8s8 3.589 8 8-3.589 8-8 8z"/></svg></a><a className="floating-insta" href="https://www.instagram.com/omicronjourneys/" target="_blank" rel="noreferrer" aria-label="Follow on Instagram" title="Follow on Instagram"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg></a><a className="floating-call" href="tel:+919322115828" aria-label="Call Us" title="Call Us">☎</a></div>
}
