import React from 'react'
import { useLanguage } from '../context/LanguageContext'

export default function PatternImage({ product, sizes, ...props }) {
  const { t } = useLanguage()
  return <img src={product.image} srcSet={product.imageSrcSet} sizes={sizes}
    alt={t(product.imageAlt || product.name, product.es?.imageAlt || product.es?.name)}
    width="600" height="600" loading="lazy" decoding="async" {...props}/>
}
