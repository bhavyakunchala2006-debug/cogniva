import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslations from './data/i18n/en.json'
import hiTranslations from './data/i18n/hi.json'
import asTranslations from './data/i18n/as.json'
import mniTranslations from './data/i18n/mni.json'

// ── i18n setup ───────────────────────────────────────────────
const savedLanguage = typeof window !== 'undefined' ? localStorage.getItem('cogniva_language') || 'en' : 'en'

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: enTranslations },
    hi: { translation: hiTranslations },
    as: { translation: asTranslations },
    mni: { translation: mniTranslations },
  },
  lng: savedLanguage,
  fallbackLng: 'en',
  interpolation: { escapeValue: false },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
