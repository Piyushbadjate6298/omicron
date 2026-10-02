import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight, Pause, Play } from 'lucide-react'
import { Link } from 'react-router-dom'
import slide1 from '../../Sliders/Images/optimized/1.jpg'
import slide2 from '../../Sliders/Images/optimized/2.jpg'
import slide3 from '../../Sliders/Images/optimized/3.jpg'
import slide4 from '../../Sliders/Images/optimized/4.jpg'
import slide5 from '../../Sliders/Images/optimized/5.jpg'
import slide6 from '../../Sliders/Images/optimized/6.jpg'
import slide7 from '../../Sliders/Images/optimized/7.jpg'
import slide8 from '../../Sliders/Images/optimized/8.jpg'

import mSlide1 from '../../Sliders/Images/Mobile View/1.png'
import mSlide2 from '../../Sliders/Images/Mobile View/2.png'
import mSlide3 from '../../Sliders/Images/Mobile View/3.png'
import mSlide4 from '../../Sliders/Images/Mobile View/4.png'
import mSlide5 from '../../Sliders/Images/Mobile View/5.png'
import mSlide6 from '../../Sliders/Images/Mobile View/6.png'
import mSlide7 from '../../Sliders/Images/Mobile View/7.png'
import mSlide8 from '../../Sliders/Images/Mobile View/8.png'
import './Hero.css'

const AUTOPLAY_DELAY = 6000

const slides = [
  { image: slide1, mobileImage: mSlide1, title: 'Airport Transfers', note: 'Premium arrivals, handled seamlessly.' },
  { image: slide2, mobileImage: mSlide2, title: 'Corporate Mobility', note: 'Professional travel that moves with your day.' },
  { image: slide3, mobileImage: mSlide3, title: 'Family Travel', note: 'Comfort and care for every generation.' },
  { image: slide4, mobileImage: mSlide4, title: 'Premium Chauffeur Rides', note: 'Business or leisure, travel beautifully.' },
  { image: slide5, mobileImage: mSlide5, title: 'Group Journeys', note: 'Effortless mobility for every group size.' },
  { image: slide6, mobileImage: mSlide6, title: 'Curated Escapes', note: 'More people, more memories, one smooth journey.' },
  { image: slide7, mobileImage: mSlide7, title: 'Event Transportation', note: 'One dependable ride for every occasion.' },
  { image: slide8, mobileImage: mSlide8, title: 'Always On Time', note: 'Reliable airport rides, whenever you need them.' },
]

export default function Hero({ onInquiry }) {
  const [activeSlide, setActiveSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const touchStart = useRef(null)

  const showSlide = useCallback((index) => {
    setActiveSlide((index + slides.length) % slides.length)
  }, [])
  const showPrevious = useCallback(() => showSlide(activeSlide - 1), [activeSlide, showSlide])
  const showNext = useCallback(() => showSlide(activeSlide + 1), [activeSlide, showSlide])

  useEffect(() => {
    if (isPaused) return undefined
    const timer = window.setInterval(() => {
      setActiveSlide((current) => (current + 1) % slides.length)
    }, AUTOPLAY_DELAY)
    return () => window.clearInterval(timer)
  }, [isPaused])

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') showPrevious()
    if (event.key === 'ArrowRight') showNext()
  }

  const handleTouchEnd = (event) => {
    if (touchStart.current === null) return
    const distance = event.changedTouches[0].clientX - touchStart.current
    if (Math.abs(distance) > 45) distance > 0 ? showPrevious() : showNext()
    touchStart.current = null
  }

  return <section
    className="journey-slider"
    aria-roledescription="carousel"
    aria-label="Omicron Journeys travel services"
    tabIndex="0"
    onKeyDown={handleKeyDown}
    onMouseEnter={() => setIsPaused(true)}
    onMouseLeave={() => setIsPaused(false)}
    onFocusCapture={() => setIsPaused(true)}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
    }}
    onTouchStart={(event) => { touchStart.current = event.touches[0].clientX }}
    onTouchEnd={handleTouchEnd}
  >
    <div className="journey-slider-stage">
      {slides.map((slide, index) => <div
        className={`journey-slide${index === activeSlide ? ' is-active' : ''}`}
        aria-hidden={index !== activeSlide}
        key={slide.image}
      >
        <picture>
          <source media="(max-width: 767px)" srcSet={slide.mobileImage} />
          <img
            src={slide.image}
            alt={index === activeSlide ? `${slide.title} with Omicron Journeys` : ''}
            loading={index === 0 ? 'eager' : 'lazy'}
            fetchpriority={index === 0 ? 'high' : 'auto'}
          />
        </picture>
      </div>)}
      <div className="journey-slider-overlay" aria-hidden="true" />
    </div>

    <button className="journey-slider-arrow journey-slider-prev" type="button" onClick={showPrevious} aria-label="Show previous slide">
      <ArrowLeft size={22}/>
    </button>
    <button className="journey-slider-arrow journey-slider-next" type="button" onClick={showNext} aria-label="Show next slide">
      <ArrowRight size={22}/>
    </button>

    <div className="container journey-slider-content">
      <div className="journey-slider-card" aria-live="polite">
        <div className="journey-slider-copy">
          <span>Omicron Journeys · {String(activeSlide + 1).padStart(2, '0')}</span>
          <strong>{slides[activeSlide].title}</strong>
          <p>{slides[activeSlide].note}</p>
        </div>
        <div className="journey-slider-actions">
          <Link className="btn journey-slider-link" to="/services">Explore Services <ArrowUpRight size={17}/></Link>
          <button className="btn btn-primary" type="button" onClick={() => onInquiry()}>Enquire Now <ArrowRight size={17}/></button>
        </div>
      </div>

      <div className="journey-slider-controls">
        <button className="journey-slider-pause" type="button" onClick={() => setIsPaused((paused) => !paused)} aria-label={isPaused ? 'Resume automatic slides' : 'Pause automatic slides'}>
          {isPaused ? <Play size={14}/> : <Pause size={14}/>}<span>{isPaused ? 'Play' : 'Pause'}</span>
        </button>
        <div className="journey-slider-dots" role="tablist" aria-label="Choose a slide">
          {slides.map((slide, index) => <button
            className={index === activeSlide ? 'is-active' : ''}
            type="button"
            role="tab"
            aria-selected={index === activeSlide}
            aria-label={`Show slide ${index + 1}: ${slide.title}`}
            onClick={() => showSlide(index)}
            key={slide.title}
          ><span/></button>)}
        </div>
        <span className="journey-slider-count"><b>{String(activeSlide + 1).padStart(2, '0')}</b> / {String(slides.length).padStart(2, '0')}</span>
      </div>
    </div>
  </section>
}