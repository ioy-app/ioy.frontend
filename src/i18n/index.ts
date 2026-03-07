import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import ru from "./resources/ru";
import en from "./resources/en";

const resources = {
	ru: { translation: ru },
	en: { translation: en },
} as const;

const languageDetector = new LanguageDetector();
languageDetector.addDetector({
	name: "localStorageDetector",
	lookup: () => localStorage.getItem("lang"),
	cacheUserLanguage: (lng) =>
		localStorage.setItem("lang", lng),
});

i18n
	.use(languageDetector)
	.use(initReactI18next)
	.init({
		resources,
		fallbackLng: "en",
		debug: process.env.NODE_ENV === "development",
		interpolation: {
			escapeValue: false,
		},
		react: { useSuspense: false },
	});

export default i18n;
