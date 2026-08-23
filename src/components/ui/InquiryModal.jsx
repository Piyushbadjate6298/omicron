import { useEffect, useState } from 'react'
import { X, Send, CheckCircle2 } from 'lucide-react'
import './InquiryModal.css'

export default function InquiryModal({ open, onClose, vehicle, initialService='Vehicle Rental' }) {
  const [form,setForm]=useState({name:'',phone:'',email:'',service:initialService,vehicle:vehicle?.name||'',date:'',persons:'',message:''})
  const [status,setStatus]=useState('idle')

  useEffect(()=>{ if(open){ setForm({name:'',phone:'',email:'',service:initialService,vehicle:vehicle?.name||'',date:'',persons:'',message:''}); setStatus('idle') } },[open,vehicle,initialService])
  useEffect(()=>{ document.body.style.overflow=open?'hidden':''; return ()=>{document.body.style.overflow=''} },[open])
  if(!open) return null
  const update=(e)=>setForm({...form,[e.target.name]:e.target.value})
  const submit=async(e)=>{
    e.preventDefault(); setStatus('loading')
    try{
      const res=await fetch('/api/inquiry',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)})
      const data=await res.json()
      if(!res.ok) throw new Error(data.message||'Unable to send inquiry')
      setStatus('success')
    }catch(err){ setStatus('error'); setForm({...form,message: `${form.message}${form.message?'\n':''}Email service setup note: ${err.message}`}) }
  }
  return <div className="modal-backdrop" role="dialog" aria-modal="true">
    <div className="modal-shell">
      <button className="modal-close" onClick={onClose} aria-label="Close inquiry form"><X size={20}/></button>
      <div className="modal-aside"><div className="eyebrow">Private booking desk</div><h2>Tell us what you need.</h2><p>Share the basics and the Omicron Journeys team can follow up with availability, route details and the final quote.</p><div className="modal-trust"><span>Fast response</span><span>Local support</span><span>Flexible fleet</span></div></div>
      <div className="modal-formwrap">
        {status==='success' ? <div className="success-state"><CheckCircle2 size={56}/><h3>Inquiry sent</h3><p>Your request has been delivered to the configured Omicron Journeys email inbox.</p><button className="btn btn-dark" onClick={onClose}>Close</button></div> : <form onSubmit={submit}>
          <div className="form-head"><div><div className="eyebrow">Inquiry</div><h3>{vehicle?.name||'Omicron Journeys'}</h3></div><span className="pill">{vehicle?`₹${vehicle.rate} ${vehicle.unit}`:'Custom quote'}</span></div>
          <div className="form-grid">
            <label>Name<input required name="name" value={form.name} onChange={update} placeholder="Your name"/></label>
            <label>Contact number<input required name="phone" value={form.phone} onChange={update} placeholder="+91 …"/></label>
            <label>Email<input type="email" name="email" value={form.email} onChange={update} placeholder="you@example.com"/></label>
            <label>Persons<input name="persons" value={form.persons} onChange={update} placeholder="e.g. 4"/></label>
            <label>Date<input type="date" name="date" value={form.date} onChange={update}/></label>
            <label>Service<select name="service" value={form.service} onChange={update}><option>Vehicle Rental</option><option>Outstation</option><option>Airport Ride</option><option>City Ride</option><option>Hotel / Event</option><option>Self Drive</option><option>Other / Commercial Inquiry</option></select></label>
            <label className="full">Message<textarea name="message" value={form.message} onChange={update} rows="4" placeholder="Pickup location, destination, duration, or any special requirement…"/></label>
          </div>
          {status==='error' && <div className="form-alert">The request could not be sent yet. Check the Vercel email environment variables, then submit again.</div>}
          <button disabled={status==='loading'} className="btn btn-primary full-submit">{status==='loading'?'Sending…':<>Submit inquiry <Send size={17}/></>}</button>
        </form>}
      </div>
    </div>
  </div>
}
