import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';

// Initialize i18next with correct settings
i18n
  .use(Backend)  // To load translations from backend (local JSON files in this case)
  .use(LanguageDetector)
  .use(initReactI18next) // Bind i18n to React
  .init({
    fallbackLng: 'en', // Default language if no language is detected
    debug: true, // Enable debugging
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    backend: {
      loadPath: '/{{lng}}.json', // Ensure correct path
    },
    react: {
      useSuspense: false, // Disable Suspense for now (you can enable later if needed)
    },
  });

export default i18n;
