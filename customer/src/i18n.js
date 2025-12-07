import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import local JSON resources so translations are available synchronously
import en from './locales/en/translation.json';
import es from './locales/es/translation.json';
import fr from './locales/fr/translation.json';
import de from './locales/de/translation.json';
import it from './locales/it/translation.json';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // ensure region tags like "en-US" are normalized to "en"
        load: 'languageOnly',
        fallbackLng: 'en',
        debug: true,
        resources: {
            en: { translation: en },
            es: { translation: es },
            fr: { translation: fr },
            de: { translation: de },
            it: { translation: it }
        },
        detection: {
            // prefer stored setting, then browser navigator
            order: ['localStorage', 'navigator', 'htmlTag'],
            caches: ['localStorage']
        },
        interpolation: {
            escapeValue: false, // React escapes by default
        },
    });

// small helper for debugging language changes in the app
i18n.on && i18n.on('languageChanged', (lng) => {
    // logs the active language (e.g. 'en' or 'es')
    // open browser console to inspect requests and behavior
    // eslint-disable-next-line no-console
    console.log('[i18n] languageChanged ->', lng);
});

export default i18n;