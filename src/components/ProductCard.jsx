import React from 'react'
import { Link } from 'react-router-dom'
import { productPath } from '../lib/catalog'
import { useLanguage } from '../context/LanguageContext'
import PatternImage from './PatternImage'
import PatternCaption from './PatternCaption'

export default function ProductCard({ product, showLanguages = true }) {
  const { t } = useLanguage()
  return <article className="catalog-card">
    <Link to={productPath(product)}>
      <div className="catalog-photo"><PatternImage product={product} sizes="(min-width: 1024px) 23vw, (min-width: 768px) 30vw, 46vw"/></div>
      <p>{t(product.category, product.es?.category)}</p>
      <PatternCaption product={product} showLanguages={showLanguages}/>
    </Link>
  </article>
}
