// /lib/i18n/languageSetup.ts

import AsyncStorage from "@react-native-async-storage/async-storage";
import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

//Mobiles
import daAllergy from "./locales/da/allergy.json";
import daAuth from "./locales/da/auth.json";
import daCommon from "./locales/da/common.json";
import daDisclaimer from "./locales/da/disclaimer.json";
import daHome from "./locales/da/home.json";
import daNavBars from "./locales/da/navbars.json";
import daprofile from "./locales/da/profile.json";
import daScan from "./locales/da/scan.json";
import daSettings from "./locales/da/setting.json";

import enAllergy from "./locales/en/allergy.json";
import enAuth from "./locales/en/auth.json";
import enCommon from "./locales/en/common.json";
import enDisclaimer from "./locales/en/disclaimer.json";
import enHome from "./locales/en/home.json";
import enNavBars from "./locales/en/navbars.json";
import enprofile from "./locales/en/profile.json";
import enScan from "./locales/en/scan.json";
import enSettings from "./locales/en/setting.json";

// Admin
import daadminHome from "./locales/da/adminHome.json";
import daadminSidebar from "./locales/da/adminSidebar.json";
import daadminUsers from "./locales/da/adminUsers.json";

import enadminHome from "./locales/en/adminHome.json";
import enadminSidebar from "./locales/en/adminSidebar.json";
import enadminUsers from "./locales/en/adminUsers.json";

export type AppLanguage = "da" | "en";

const languageResources = {
    da: {
        common: daCommon,
        home: daHome,
        auth: daAuth,
        navbars: daNavBars,
        scan: daScan,
        allergy: daAllergy,
        settings: daSettings,
        disclaimer: daDisclaimer,
        profile: daprofile,
        adminhome: daadminHome,
        adminsidebar: daadminSidebar,
        adminusers: daadminUsers,
    },
    en: {
        common: enCommon,
        home: enHome,
        auth: enAuth,
        navbars: enNavBars,
        scan: enScan,
        allergy: enAllergy,
        settings: enSettings,
        disclaimer: enDisclaimer,
        profile: enprofile,
        adminhome: enadminHome,
        adminsidebar: enadminSidebar,
        adminusers: enadminUsers,
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