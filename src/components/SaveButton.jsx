import React from 'react'
import { useWishlist } from '../context/WishlistContext'
import { useLanguage } from '../context/LanguageContext'
import { Icon } from '../icons'

export default function SaveButton({ product, className = 'size-11 border-white/60 bg-white/95 hover:bg-white' }) {
  const { saved, toggle } = useWishlist()
  const { t } = useLanguage()
  const selected = saved.has(product.slug)
  return <button className={'inline-grid shrink-0 cursor-pointer place-items-center rounded-full border text-[#047857] aria-pressed:[&_svg]:fill-current ' + className} type="button" aria-pressed={selected}
    aria-label={(selected ? t('Unsave', 'Quitar de guardados') : t('Save', 'Guardar')) + ' · ' + t(product.shortName || product.name, product.es?.shortName || product.es?.name)}
    onClick={() => toggle(product.slug)}>
    <Icon name="heart" size={19}/>
  </button>
}
