import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';

i18n
    .use(HttpBackend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // ensure region tags like "en-US" are normalized to "en"
        load: 'languageOnly',
        fallbackLng: 'en',
        debug: true,
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
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

i18n.on && i18n.on('languageChanged', (lng) => {
    console.log('[i18n] languageChanged ->', lng);
});

export default i18n;