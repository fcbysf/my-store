import React from 'react'
import { useLanguage } from '../context/LanguageContext'
import { displayPrice } from '../lib/catalog'

export default function PatternCaption({ product, showFormatBadge = true, showLanguages = true }) {
  const { t, language } = useLanguage()
  const name = t(product.shortName || product.name, product.es?.shortName || product.es?.name)
  const languages = product.languages?.map(label => ({ English: 'EN', Spanish: 'ES' })[label] || label)
  return <div className="pattern-caption">
    <h3>{name}</h3>
    <div className="pattern-meta">
      <strong>{displayPrice(product, language)}</strong>
      {showFormatBadge && <span className="format-badge">PDF{showLanguages && languages?.length > 0 && ' · ' + languages.join(' + ')}</span>}
    </div>
  </div>
}
