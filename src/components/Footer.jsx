import React from 'react'
import { Link } from 'react-router-dom'
import { useLanguage } from '../context/LanguageContext'
import Brand from './Brand'
import { Icon } from '../icons'
import { shell } from './styles'

export default function Footer() {
  const { t } = useLanguage()
  const faq = [
    [t('What comes with my pattern?', '¿Qué incluye mi patrón?'), t('You receive downloadable PDF instructions. Each pattern page lists its files, photos and any video tutorials.', 'Recibirás instrucciones en PDF para descargar. En la página de cada patrón encontrarás sus archivos, fotos y videotutoriales incluidos.')],
    [t('Which languages are included?', '¿En qué idiomas están los patrones?'), t('The collection includes instructions in English and Spanish. See each pattern’s details for the files included in a bundle.', 'La colección incluye instrucciones en inglés y español. Consulta los detalles de cada patrón para ver los archivos de cada colección.')],
    [t('How do I download my pattern?', '¿Cómo descargo mi patrón?'), t('For Pocketsflow orders, open the purchase link in your receipt email. For Fourthwall orders, look for the download email sent to the address you used at checkout.', 'Para pedidos en Pocketsflow, abre el enlace de compra del recibo que recibirás por correo. Para pedidos en Fourthwall, busca el correo de descarga en la dirección que usaste al pagar.')]
  ]
  return <footer className="shop-footer"><div className={shell + ' footer-grid'}>
    <div><Brand/><p>{t('Digital crochet patterns in English and Spanish.', 'Patrones digitales de crochet en inglés y español.')}</p></div>
    <nav aria-label={t('Footer navigation','Navegación del pie de página')}>
      <h2>{t('Shop','Tienda')}</h2>
      <Link to="/products">{t('All patterns','Todos los patrones')}</Link>
      <Link to="/products?saved=1">{t('Saved patterns','Patrones guardados')}</Link>
      <a href="#faq">{t('Pattern FAQ','Preguntas frecuentes')}</a>
    </nav>
    <section className="order-help" aria-labelledby="order-help-title">
      <h2 id="order-help-title">{t('Order help','Ayuda con pedidos')}</h2>
      <p>{t('For help with an order, use the platform shown in your purchase receipt.', 'Si necesitas ayuda con un pedido, utiliza la plataforma que aparece en tu recibo de compra.')}</p>
      <nav aria-labelledby="pocketsflow-help">
        <h3 id="pocketsflow-help">Pocketsflow</h3>
        <a href="https://www.pocketsflow.com/support">{t('Order support','Ayuda con pedidos')}</a>
        <a href="https://www.pocketsflow.com/refund-policy">{t('Refund policy','Política de reembolsos')}</a>
      </nav>
      <nav aria-labelledby="fourthwall-help">
        <h3 id="fourthwall-help">Fourthwall</h3>
        <a href="https://crochet-art-hwz-shop.fourthwall.com/contact">{t('Contact order support','Contactar con soporte')}</a>
        <a href="https://crochet-art-hwz-shop.fourthwall.com/pages/returns-faq">{t('Returns & FAQ','Devoluciones y preguntas frecuentes')}</a>
      </nav>
    </section>
    <section id="faq"><h2>{t('Pattern FAQ','Preguntas frecuentes')}</h2>
      {faq.map(([q,a]) => <details key={q}><summary>{q}<Icon name="plus" size={16}/></summary><p>{a}</p></details>)}
    </section>
  </div></footer>
}
