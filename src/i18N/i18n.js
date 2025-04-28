import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18n
i18n
  .use(LanguageDetector)
  .use(HttpBackend) // Using HTTP backend to load translation files
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    interpolation: {
      escapeValue: false, // React already escapes
    },
    backend: {
      loadPath: '/src/components/i18N/{{lng}}.json', // Path to your JSON files
    },
  });

export default i18n;
