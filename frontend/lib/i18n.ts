// Multilingual Global Support imported from DashboardModule
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';
import enTranslations from '../public/locales/en/translation.json';

i18n
    .use(HttpBackend)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',
        lng: 'en',
        supportedLngs: ['en', 'hi', 'te'],
        resources: {
            en: {
                translation: enTranslations
            }
        },
        partialBundledLanguages: true,

        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },

        interpolation: {
            escapeValue: false,
        },

        react: {
            useSuspense: false,
        },

        detection: {
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
        },
    });

export default i18n;
