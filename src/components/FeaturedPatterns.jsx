import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import { productPath } from '../lib/catalog'
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
  const [view, setView] = useState({ first: 1, last: 1, start: true, end: false })
  useEffect(() => {
    const el = track.current
    if (products.length < 2) return
    const mobileMotion = matchMedia('(max-width: 767px) and (prefers-reduced-motion: no-preference)')
    const events = new AbortController()
    const listener = { signal: events.signal, passive: true }
    let visible = false
    let touching = false
    let timer
    function schedule() {
      clearTimeout(timer)
      if (!mobileMotion.matches || document.hidden || !visible || touching || el.matches(':focus-within')) return
      timer = setTimeout(() => {
        const next = positions(el).find(left => left > el.scrollLeft + 2)
        el.scrollTo({ left: next ?? 0, behavior: next === undefined ? 'instant' : 'smooth' })
      }, 2000)
    }
    function touch(event) {
      touching = event.touches.length > 0
      schedule()
    }
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.intersectionRatio >= 0.25
      schedule()
    }, { threshold: 0.25 })
    observer.observe(el)
    mobileMotion.addEventListener('change', schedule, listener)
    document.addEventListener('visibilitychange', schedule, listener)
    for (const type of ['scroll', 'focusin', 'focusout']) el.addEventListener(type, schedule, listener)
    for (const type of ['touchstart', 'touchend', 'touchcancel']) el.addEventListener(type, touch, listener)
    return () => {
      clearTimeout(timer)
      observer.disconnect()
      events.abort()
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
      setView({ first: visible[0] || 1, last: visible.at(-1) || 1, start: el.scrollLeft < 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 })
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
  return <section className="hero" aria-labelledby="hero-title">
    <div className="hero-inner">
      <div className="hero-intro">
        <h1 id="hero-title">{t('Your next favorite crochet project.', 'Tu próximo proyecto favorito de crochet.')}</h1>
        <p>{t('Discover digital crochet patterns in English and Spanish.', 'Descubre patrones digitales de crochet en inglés y español.')}</p>
        <a className="shop-button" href="#patterns">{t('Explore patterns','Explorar patrones')}<Icon name="arrow" size={18}/></a>
      </div>
      <section className="featured" aria-labelledby="featured-title" aria-roledescription={t('carousel','carrusel')}>
        <div className="featured-heading">
          <h2 id="featured-title">{t('Featured patterns','Patrones destacados')}</h2>
          <div className="featured-controls">
            <span aria-live="polite" aria-atomic="true">{view.first}{view.last > view.first && '–' + view.last} / {products.length}</span>
            <button aria-controls="featured-track" aria-label={t('Previous patterns','Patrones anteriores')} disabled={view.start} onClick={() => move(-1)}><Icon name="arrow" className="rotate-180" size={17}/></button>
            <button aria-controls="featured-track" aria-label={t('Next patterns','Patrones siguientes')} disabled={view.end} onClick={() => move(1)}><Icon name="arrow" size={17}/></button>
          </div>
        </div>
        <div className="featured-track" id="featured-track" ref={track} tabIndex={0} role="group" aria-labelledby="featured-title"
          onKeyDown={event => {
            if (!['ArrowLeft','ArrowRight'].includes(event.key)) return
            event.preventDefault()
            const direction = event.key === 'ArrowRight' ? 1 : -1
            if (event.target === track.current) move(direction)
            else (direction > 0 ? event.target.nextElementSibling : event.target.previousElementSibling)?.focus()
          }}>
          {products.map((product,i) => <Link className="featured-card" key={product.slug} to={productPath(product)}>
            <PatternImage product={product} loading={i < 2 ? 'eager' : 'lazy'} fetchPriority={i === 0 ? 'high' : 'auto'} style={{ objectPosition: product.featuredImagePosition }}
              sizes="(min-width: 1350px) 290px, (min-width: 768px) 22vw, clamp(210px, 54.6vw, 236px)"/>
            <PatternCaption product={product} showFormatBadge={false}/>
          </Link>)}
        </div>
      </section>
    </div>
  </section>
}
