// /components/app/mobil/settings/LanguageSettings.tsx

import { useAppLanguage } from "@/lib/i18n/useAppLanguage";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const languageOptions = [
    {
        key: "da",
        labelKey: "languageOptionDa",
    },
    {
        key: "en",
        labelKey: "languageOptionEn",
    },
] as const;

export function LanguageSettings() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("settings");
    const { lang, changeLanguage } = useAppLanguage();

    const handleSelect = async (key: "da" | "en") => {
        if (lang === key) return;

        try {
            await changeLanguage(key);
        } catch (error) {
            console.error("Error changing language:", error);
        }
    };

    return (
        <View>
            <Text
                className="mb-3 text-lg font-semibold"
                style={{ color: theme.text }}
            >
                {t("languageSettingsTitle")}
            </Text>

            <View className="flex-col gap-3">
                {languageOptions.map((item) => {
                    const active = lang === item.key;

                    return (
                        <TouchableOpacity
                            key={item.key}
                            onPress={() => handleSelect(item.key)}
                            activeOpacity={0.7}
                            className="flex-row items-center rounded-xl border p-4"
                            style={{
                                borderColor: active ? theme.active : theme.border,
                                backgroundColor: active
                                    ? theme.activeSoft
                                    : theme.surfaceSoft,
                            }}
                        >
                            <View className="flex-1 pr-4">
                                <Text
                                    className="text-base font-medium"
                                    style={{
                                        color: active ? theme.active : theme.text,
                                    }}
                                >
                                    {t(item.labelKey)}
                                </Text>
                            </View>

                            {active && (
                                <View
                                    className="h-3 w-3 rounded-full"
                                    style={{ backgroundColor: theme.active }}
                                />
                            )}
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}