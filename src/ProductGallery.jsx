import React, { useRef, useState } from 'react'
import Dialog from './Dialog'
import { Icon } from './icons'
import { iconButton } from './components/styles'

const overlayButton = iconButton + ' absolute bg-white/95 shadow-sm hover:bg-white'
const photoNav = overlayButton + ' top-1/2 -translate-y-1/2'

const bilingualAlt = image => [image.alt, image.altEs].filter(Boolean).join(' / ')

export default function ProductGallery({ product }) {
  const photos = [
    { src: product.image, alt: product.imageAlt, altEs: product.es?.imageAlt },
    ...(product.gallery || [])
  ]
  const [active, setActive] = useState(0)
  const [zoom, setZoom] = useState(false)
  const track = useRef(null)
  const multiple = photos.length > 1
  const selected = photos[active]
  const label = 'Product photos / Fotos del producto'

  function select(index) {
    const next = (index + photos.length) % photos.length
    const element = track.current
    element.scrollTo({ left: element.clientWidth * next, behavior: 'instant' })
    setActive(next)
  }

  function handleKeys(event) {
    if (!multiple) return
    const keys = { ArrowLeft: active - 1, ArrowRight: active + 1, Home: 0, End: photos.length - 1 }
    if (!(event.key in keys)) return
    event.preventDefault()
    select(keys[event.key])
  }

  const controls = multiple && <>
    <button className={photoNav + " left-2 [&_svg]:rotate-90"} aria-label="Previous photo / Foto anterior" onClick={() => select(active - 1)}><Icon name="chevron"/></button>
    <button className={photoNav + " right-2 [&_svg]:-rotate-90"} aria-label="Next photo / Foto siguiente" onClick={() => select(active + 1)}><Icon name="chevron"/></button>
    <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-[#064e3be8] px-3 py-1 text-xs text-white tabular-nums" aria-live="polite"><span className="sr-only">Photo / Foto </span>{active + 1} / {photos.length}</span>
  </>

  return <section className={`grid min-w-0 grid-cols-1 gap-2 md:sticky md:top-4 ${multiple ? " xl:grid-cols-[auto_minmax(0,1fr)]" : ""}`} aria-label={label} onKeyDown={handleKeys}>
    <div className="relative aspect-square min-w-0 overflow-hidden rounded-2xl bg-[#e4f8ef]">
      <div className="flex size-full snap-x snap-mandatory overflow-x-auto overflow-y-hidden overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden focus-visible:-outline-offset-4" ref={track} tabIndex={multiple ? 0 : -1} aria-label={label}
        onScroll={event => {
          const {scrollLeft, clientWidth} = event.currentTarget
          if (clientWidth) setActive(Math.max(0, Math.min(photos.length - 1, Math.round(scrollLeft / clientWidth))))
        }}>
        {photos.map((photo,index) => <img className="size-full flex-none snap-start snap-always object-contain" key={photo.src} src={photo.src}
          alt={bilingualAlt(photo)} draggable="false" loading={index === 0 ? 'eager' : 'lazy'}/>)}
      </div>
      {controls}
      <button className={overlayButton + " right-3 bottom-3"} aria-label="Enlarge photo / Ampliar foto" onClick={() => setZoom(true)}><Icon name="zoom"/></button>
    </div>
    {multiple && <div className="flex min-w-0 gap-1.5 overflow-x-auto overscroll-x-contain p-1 xl:order-first xl:max-h-[55vh] xl:flex-col xl:overflow-y-auto" aria-label="Choose photo / Elegir foto">
      {photos.map((photo,index) => <button className="shrink-0 cursor-pointer rounded-lg border-2 border-transparent p-0.5 aria-pressed:border-[#047857]" key={photo.src} aria-label={'Photo / Foto ' + (index + 1)}
        aria-pressed={active === index} onClick={() => select(index)}>
        <img className="size-12 rounded-sm object-cover xl:size-[clamp(42px,4.15vw,66px)]" src={photo.src} alt="" width="60" height="60"/>
      </button>)}
    </div>}
    {zoom && <Dialog label={label} onClose={() => setZoom(false)} className="w-[min(760px,calc(100%-1.5rem))]" innerClassName="relative">
      <img className="max-h-[81dvh] w-full object-contain" src={selected.src} alt={bilingualAlt(selected)}/>{controls}
      <button className={overlayButton + " top-2 right-2"} aria-label="Close photo / Cerrar foto" onClick={() => setZoom(false)} autoFocus><Icon name="close"/></button>
    </Dialog>}
  </section>
}
