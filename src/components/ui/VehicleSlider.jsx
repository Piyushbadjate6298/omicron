import { useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import './VehicleSlider.css'

export default function VehicleSlider({ vehicle, onClose }) {
  const images = vehicle.gallery && vehicle.gallery.length > 0
    ? vehicle.gallery
    : [vehicle.image]

  const [current, setCurrent] = useState(0)
  const touchStart = useRef(null)
  const autoRef = useRef(null)

  const go = (dir) => {
    setCurrent(c => (c + dir + images.length) % images.length)
  }

  // Auto-advance
  useEffect(() => {
    if (images.length <= 1) return
    autoRef.current = setInterval(() => go(1), 3500)
    return () => clearInterval(autoRef.current)
  }, [images.length])

  // Pause on interaction
  const resetAuto = () => {
    clearInterval(autoRef.current)
    autoRef.current = setInterval(() => go(1), 3500)
  }

  // Keyboard
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') { go(1); resetAuto() }
      if (e.key === 'ArrowLeft') { go(-1); resetAuto() }
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handler)
      document.body.style.overflow = ''
    }
  }, [])

  const handleTouchStart = (e) => { touchStart.current = e.touches[0].clientX }
  const handleTouchEnd = (e) => {
    if (touchStart.current === null) return
    const diff = touchStart.current - e.changedTouches[0].clientX
    if (Math.abs(diff) > 40) { go(diff > 0 ? 1 : -1); resetAuto() }
    touchStart.current = null
  }

  return (
    <div className="vslider-backdrop" onClick={onClose}>
      <div className="vslider-modal" onClick={e => e.stopPropagation()}
        onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>

        {/* Close */}
        <button className="vslider-close" onClick={onClose} aria-label="Close"><X size={20} /></button>

        {/* Title bar */}
        <div className="vslider-header">
          <span className="vslider-name">{vehicle.name}</span>
          {images.length > 1 && <span className="vslider-count">{current + 1} / {images.length}</span>}
        </div>

        {/* Main image */}
        <div className="vslider-stage">
          {images.map((src, i) => (
            <div key={i} className={'vslider-slide' + (i === current ? ' active' : '')}>
              <img src={src} alt={vehicle.name + ' photo ' + (i + 1)} draggable={false} />
            </div>
          ))}

          {images.length > 1 && (
            <>
              <button className="vslider-arrow left" onClick={() => { go(-1); resetAuto() }} aria-label="Previous">
                <ChevronLeft size={28} />
              </button>
              <button className="vslider-arrow right" onClick={() => { go(1); resetAuto() }} aria-label="Next">
                <ChevronRight size={28} />
              </button>
            </>
          )}
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="vslider-thumbs">
            {images.map((src, i) => (
              <button key={i} className={'vslider-thumb' + (i === current ? ' active' : '')}
                onClick={() => { setCurrent(i); resetAuto() }}>
                <img src={src} alt={'Thumbnail ' + (i + 1)} />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
