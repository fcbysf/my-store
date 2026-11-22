import React, { useEffect, useRef, useState } from 'react'
import { useLanguage } from '../context/LanguageContext'
import { Icon } from '../icons'
import PatternImage from './PatternImage'
import PatternCaption from './PatternCaption'

function positions(track) {
  const max = track.scrollWidth - track.clientWidth
  return [...new Set(Array.from(track.children, card => Math.min(card.offsetLeft - track.firstElementChild.offsetLeft, max)))]
}

export default function FeaturedPatterns({ products }) {
  const { t } = useLanguage()
  const track = useRef(null)
  const [view, setView] = useState({ first: 1, last: 1, start: true, end: false, progress: 0 })
  useEffect(() => {
    if (products.length < 2) return
    const el = track.current
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)')
    let timer
    function pause() {
      clearInterval(timer)
    }
    function start() {
      pause()
      if (document.hidden || reducedMotion.matches) return
      timer = setInterval(() => {
        if (el.closest('.hero').matches(':focus-within') || el.scrollWidth <= el.clientWidth) return
        const next = positions(el).find(left => left > el.scrollLeft + 2)
        el.scrollTo({ left: next ?? 0, behavior: next === undefined ? 'instant' : 'smooth' })
      }, 2000)
    }
    start()
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', start)
    el.addEventListener('touchcancel', start)
    document.addEventListener('visibilitychange', start)
    reducedMotion.addEventListener('change', start)
    return () => {
      pause()
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', start)
      el.removeEventListener('touchcancel', start)
      document.removeEventListener('visibilitychange', start)
      reducedMotion.removeEventListener('change', start)
    }
  }, [products])

  useEffect(() => {
    const el = track.current
    function measure() {
      const bounds = el.getBoundingClientRect()
      const visible = Array.from(el.children).flatMap((card,i) => {
        const { left, right, width } = card.getBoundingClientRect()
        return Math.min(right, bounds.right) - Math.max(left, bounds.left) > width / 2 ? [i + 1] : []
      })
      const max = el.scrollWidth - el.clientWidth
      setView({ progress: max > 0 ? Math.min(el.scrollLeft / max, 1) : 0, first: visible[0] || 1, last: visible.at(-1) || 1, start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    el.addEventListener('scroll', measure, { passive: true })
    return () => { observer.disconnect(); el.removeEventListener('scroll', measure) }
  }, [products])
  function move(direction) {
    const el = track.current
    const stops = positions(el)
    const left = direction > 0 ? stops.find(x => x > el.scrollLeft + 2) : stops.reverse().find(x => x < el.scrollLeft - 2)
    if (left !== undefined) el.scrollTo({ left, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' })
  }
  return <section className="hero" aria-labelledby="featured-title" aria-roledescription={t('carousel','carrusel')}>
    <h1 className="sr-only" id="featured-title">{t('Featured crochet patterns','Patrones de crochet destacados')}</h1>
    <div className="hero-inner">
      <div className="featured-track" id="featured-track" ref={track} tabIndex={0} role="group" aria-labelledby="featured-title"
        onKeyDown={event => {
          if (!['ArrowLeft','ArrowRight'].includes(event.key)) return
          event.preventDefault()
          const direction = event.key === 'ArrowRight' ? 1 : -1
          if (event.target === track.current) move(direction)
          else (direction > 0 ? event.target.nextElementSibling : event.target.previousElementSibling)?.focus()
        }}>
        {products.map((product, i) => <a className="featured-card" key={product.slug} href={product.productUrl}>
          <PatternImage product={product} loading={i < 3 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'}
            style={{ objectPosition: product.featuredImagePosition }}
            sizes="(min-width: 1350px) 400px, (min-width: 1024px) 31vw, (min-width: 768px) 42vw, 82vw"/>
          <PatternCaption product={product} showFormatBadge={false}/>
        </a>)}
      </div>
      {!(view.start && view.end) && <div className="featured-controls">
        <button type="button" aria-controls="featured-track" aria-label={t('Previous patterns','Patrones anteriores')} disabled={view.start} onClick={() => move(-1)}><Icon name="arrow" className="rotate-180" size={18}/></button>
        <div className="featured-progress" aria-hidden="true">
          <span style={{ left: (view.progress * 70) + '%' }}/>
        </div>
        <span className="sr-only">{view.first}{view.last > view.first && '–' + view.last} / {products.length}</span>
        <button type="button" aria-controls="featured-track" aria-label={t('Next patterns','Patrones siguientes')} disabled={view.end} onClick={() => move(1)}><Icon name="arrow" size={18}/></button>
      </div>}
    </div>
  </section>
}
