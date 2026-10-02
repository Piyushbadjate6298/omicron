import { useCallback, useEffect, useRef, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import './FocusCarousel.css'

export default function FocusCarousel({ items, renderItem, getImage, label, interval = 5200, className = '' }) {
  const [active, setActive] = useState(0)
  const [direction, setDirection] = useState('next')
  const [paused, setPaused] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const pointerStart = useRef(null)

  const show = useCallback((index, nextDirection = 'next') => {
    setDirection(nextDirection)
    setActive((index + items.length) % items.length)
  }, [items.length])

  const next = useCallback(() => show(active + 1, 'next'), [active, show])
  const previous = useCallback(() => show(active - 1, 'previous'), [active, show])

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const syncPreference = () => setReducedMotion(media.matches)
    syncPreference()
    media.addEventListener?.('change', syncPreference)
    return () => media.removeEventListener?.('change', syncPreference)
  }, [])

  useEffect(() => {
    if (paused || reducedMotion || items.length < 2) return undefined
    const timer = window.setInterval(next, interval)
    return () => window.clearInterval(timer)
  }, [active, interval, items.length, next, paused, reducedMotion])

  const finishSwipe = (clientX) => {
    if (pointerStart.current === null) return
    const distance = clientX - pointerStart.current
    pointerStart.current = null
    if (Math.abs(distance) < 45) return
    if (distance < 0) next()
    else previous()
  }

  if (!items.length) return null

  return <div
    className={`focus-carousel ${className}`.trim()}
    role="region"
    aria-roledescription="carousel"
    aria-label={label}
    onMouseEnter={() => setPaused(true)}
    onMouseLeave={() => setPaused(false)}
    onFocusCapture={() => setPaused(true)}
    onBlurCapture={(event) => {
      if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false)
    }}
    onPointerDown={(event) => { pointerStart.current = event.clientX }}
    onPointerUp={(event) => finishSwipe(event.clientX)}
    onPointerCancel={() => { pointerStart.current = null }}
    onKeyDown={(event) => {
      if (event.key === 'ArrowLeft') previous()
      if (event.key === 'ArrowRight') next()
    }}
  >
    <div
      key={`backdrop-${active}`}
      className="focus-carousel-backdrop"
      style={{ backgroundImage: `url("${getImage(items[active])}")` }}
      aria-hidden="true"
    />
    <div className="focus-carousel-shade" aria-hidden="true"/>
    <div className="focus-carousel-stage">
      <div key={`${active}-${direction}`} className={`focus-carousel-slide is-${direction}`} aria-live="polite">
        {renderItem(items[active], active)}
      </div>
      {items.length > 1 && <>
        <button className="focus-carousel-arrow focus-carousel-previous" type="button" onClick={previous} aria-label="Show previous slide"><ChevronLeft size={22}/></button>
        <button className="focus-carousel-arrow focus-carousel-next" type="button" onClick={next} aria-label="Show next slide"><ChevronRight size={22}/></button>
      </>}
    </div>
    {items.length > 1 && <div className="focus-carousel-footer">
      <span className="focus-carousel-count"><b>{String(active + 1).padStart(2, '0')}</b> / {String(items.length).padStart(2, '0')}</span>
      <div className="focus-carousel-dots" role="tablist" aria-label="Choose a slide">
        {items.map((item, index) => <button
          key={item.name || item.slug || index}
          type="button"
          className={index === active ? 'active' : ''}
          onClick={() => show(index, index >= active ? 'next' : 'previous')}
          role="tab"
          aria-selected={index === active}
          aria-label={`Show slide ${index + 1}`}
        />)}
      </div>
      <span className="focus-carousel-hint">Swipe or use arrows</span>
    </div>}
  </div>
}
