// /lib/i18n/languageSetup.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import daHome from "./locales/da/home.json";

import enHome from "./locales/en/home.json";


export type AppLanguage = "da" | "en";

const languageResources = {
    da: {
        home: daHome,
    },
    en: {
        home: enHome,
    },
};

const storedLanguageKey = "appLanguage";

function getDeviceLanguage(): AppLanguage {
    const appLanguage = getLocales()[0];
    const languageCode = appLanguage?.languageCode;

    if (languageCode === "en") {
        return "en";
    }

    return "da";
}

export async function setAppLanguage(language: AppLanguage) {
    await i18n.changeLanguage(language);
    await AsyncStorage.setItem(storedLanguageKey, language);
}

export async function loadSavedLanguage() {
    const savedLanguage = await AsyncStorage.getItem(storedLanguageKey);

    if (savedLanguage === "da" || savedLanguage === "en") {
        await i18n.changeLanguage(savedLanguage);
        return savedLanguage;
    }

    const deviceLanguage = getDeviceLanguage();

    await i18n.changeLanguage(deviceLanguage);
    await AsyncStorage.setItem(storedLanguageKey, deviceLanguage);

    return deviceLanguage;
}

i18n.use(initReactI18next).init({
    compatibilityJSON: "v4",
    lng: "da",
    fallbackLng: "da",
    defaultNS: "common",
    resources: languageResources,
    interpolation: {
        escapeValue: false,
    },
});

export default i18n;