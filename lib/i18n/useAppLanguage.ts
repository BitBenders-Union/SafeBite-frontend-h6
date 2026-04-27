// /lib/i18n/useAppLanguage.ts

import i18n, { AppLanguage, setAppLanguage } from "@/lib/i18n/languageSetup";

export function useAppLanguage() {
    const currentLanguage = i18n.language === "en" ? "en" : "da";

    async function changeLanguage(language: AppLanguage) {
        await setAppLanguage(language);
    }

    return {
        lang: currentLanguage,
        changeLanguage,
    };
}