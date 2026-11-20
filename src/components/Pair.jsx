import { useLanguage } from '../context/LanguageContext'

export default function Pair({ en, es }) {
  return useLanguage().t(en, es)
}
