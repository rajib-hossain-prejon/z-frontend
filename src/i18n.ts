import React from 'react';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-http-backend';
import Cookies from 'js-cookie';

import LanguageDetector from 'i18next-browser-languagedetector';
// don't want to use this?
// have a look at the Quick start guide
// for passing in lng and translations on init

import enLocale from './locales/en/index.json';
import enValidations from './locales/en/validations.json';
import enUploader from './locales/en/uploader.json';
import enHome from './locales/en/home.json';
import enPricing from './locales/en/pricing.json';
import enTornado from './locales/en/tornado.json';
import enAuth from './locales/en/auth.json';
import enDashboard from './locales/en/dashboard.json';
import enManage from './locales/en/manage.json';
import enAds from './locales/en/ads.json';
import deLocale from './locales/de/index.json';
import deValidations from './locales/de/validations.json';
import deUploader from './locales/de/uploader.json';
import deHome from './locales/de/home.json';
import dePricing from './locales/de/pricing.json';
import deTornado from './locales/de/tornado.json';
import deAuth from './locales/de/auth.json';
import deDashboard from './locales/de/dashboard.json';
import deManage from './locales/de/manage.json';
import deAds from './locales/de/ads.json';
import { isBrowser } from './utils';

export const langMap: Record<string, string> = {
  English: 'en',
  Deutsch: 'de',
  de: 'Deutsch',
  en: 'English',
};

const lngDetector = new LanguageDetector(null, {
  order: ['cookie', 'navigator', 'localStorage'],
  lookupCookie: 'zoxxo-language',
  lookupLocalStorage: 'zoxxo-language',
  cookieMinutes: 360 * 24 * 60,
  caches: ['cookie', 'localStorage'],
});

i18n
  .use(Backend)
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(lngDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    resources: {
      en: {
        common: enLocale,
        validations: enValidations,
        uploader: enUploader,
        home: enHome,
        pricing: enPricing,
        tornado: enTornado,
        auth: enAuth,
        dashboard: enDashboard,
        manage: enManage,
        ads: enAds,
      },
      de: {
        common: deLocale,
        validations: deValidations,
        uploader: deUploader,
        home: deHome,
        pricing: dePricing,
        tornado: deTornado,
        auth: deAuth,
        dashboard: deDashboard,
        manage: deManage,
        ads: deAds,
      },
    },
    fallbackLng: 'en',
    ns: [
      'common',
      'uploader',
      'home',
      'pricing',
      'tornado',
      'auth',
      'dashboard',
      'manage',
      'ads',
      'validations',
    ],
    defaultNS: 'common',
    debug: false,
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
  }, () => {
    if (isBrowser()) {
      const d = new Date();
      d.setDate(360);
      Cookies.set('zoxxo-language', i18n.language.split('-')[0], { expires: d });
    }
  });

export const useLanguage = () => {
  const [lng, _setLng] = React.useState<{ name: string; key: string }>({
    name: langMap[i18n.language.split('-')[0]] || 'English',
    key: i18n.language.split('-')[0] || 'en',
  });

  const changeLanguage = (lngKey: string) => {
    i18n
      .changeLanguage(lngKey)
      .then(() => {
        _setLng({
          name: langMap[lngKey],
          key: lngKey,
        });
      })
      .catch(console.log);
  };

  React.useEffect(() => {
    i18n.on('languageChanged', (l) => {
      if (l === lng.key) return; // no need to set state, this will lead to infinite set calls
      _setLng({ name: langMap[i18n.language.split('-')[0]], key: i18n.language.split('-')[0] });
      if (isBrowser()) {
        const d = new Date();
        d.setDate(360);
        Cookies.set('zoxxo-language', i18n.language.split('-')[0], { expires: d });
      }
    });
  }, [i18n]);

  return { language: lng, changeLanguage };
};

export default i18n;
