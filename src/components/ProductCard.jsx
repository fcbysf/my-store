import React from 'react'
import { Link } from 'react-router-dom'
import { displayPrice, homeCardTitle, productPath } from '../lib/catalog'
import { useLanguage } from '../context/LanguageContext'
import PatternImage from './PatternImage'
import SaveButton from './SaveButton'

export default function ProductCard({ product, home = false }) {
  const { t, language } = useLanguage()
  return <article className="catalog-card">
    <Link to={productPath(product)}>
      <div className="catalog-photo"><PatternImage product={product} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 46vw"/></div>
      <p>{t(product.category, product.es?.category)}</p>
      <h3>{home ? homeCardTitle(product, language) : t(product.shortName || product.name, product.es?.shortName || product.es?.name)}</h3>
      <strong>{displayPrice(product, language)}</strong>
    </Link>
    <SaveButton product={product} className="absolute top-2 right-2 size-11 border-white/60 bg-white/95 hover:bg-white"/>
  </article>
}
