// /components/app/mobil/settings/ThemeSettings.tsx

import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

const themeOptions = [
    {
        key: "device",
        labelKey: "themeOptionDevice",
    },
    {
        key: "light",
        labelKey: "themeOptionLight",
    },
    {
        key: "dark",
        labelKey: "themeOptionDark",
    },
] as const;

export function ThemeSettings() {
    const { theme, mode, changeTheme } = useAppTheme();
    const { t } = useTranslation("settings");

    const handleSelect = async (key: "device" | "light" | "dark") => {
        if (mode === key) return;

        try {
            await changeTheme(key);
        } catch (error) {
            console.error("Error changing theme:", error);
        }
    };

    return (
        <View>
            <Text
                className="mb-3 text-lg font-semibold"
                style={{ color: theme.text }}
            >
                {t("themeSettingsTitle")}
            </Text>

            <View className="flex-col gap-3">
                {themeOptions.map((item) => {
                    const active = mode === item.key;

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