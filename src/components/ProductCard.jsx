import React from 'react'
import { Link } from 'react-router-dom'
import { displayPrice, productPath } from '../lib/catalog'
import SaveButton from './SaveButton'
import Pair from './Pair'
import { heading } from './styles'

export default function ProductCard({ product }) {
  return <article className="relative min-w-0">
    <Link className="group block h-full rounded-xl wrap-anywhere" to={productPath(product)}>
      <div className="aspect-square overflow-hidden rounded-xl bg-[#e4f8ef]"><img className="size-full object-cover motion-safe:transition-transform motion-safe:group-hover:scale-[1.035]" src={product.image} alt={product.imageAlt || product.name}
        width="500" height="500" loading="lazy"/></div>
      <div className="mt-2 mb-1 flex flex-wrap items-baseline justify-between gap-x-2 gap-y-0.5"><span className="text-[.7rem] font-semibold tracking-wider text-[#59736a] uppercase"><Pair en={product.category} es={product.es?.category}/></span><strong className="text-sm text-[#047857] tabular-nums">{displayPrice(product)}</strong></div>
      <h3 className={heading + " text-lg tracking-tight group-hover:text-[#047857] group-hover:underline group-hover:underline-offset-4 lg:text-2xl"}>{product.name}</h3>
      {product.es?.name && <p className="mt-1 text-sm leading-snug text-[#59736a]" lang="es">{product.es.name}</p>}
    </Link>
    <SaveButton product={product} className="absolute top-2 right-2 size-11 border-white/60 bg-white/95 shadow-sm hover:bg-white"/>
  </article>
}
