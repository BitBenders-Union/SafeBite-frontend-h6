// /app/(app)/(admin)/adminSettings.tsx

import { LanguageSettings } from "@/components/app/mobil/settings/LanguageSettings";
import { LogoutSettings } from "@/components/app/mobil/settings/LogoutSettings";
import { ThemeSettings } from "@/components/app/mobil/settings/ThemeSettings";
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

export default function AdminSettings() {
    const { t } = useTranslation("adminsetting");
    const { theme } = useAppTheme();

    return (
        <View className="flex-1 px-6 pt-12 items-center">
            <View className="w-full max-w-[1100px]">                
                <View className="mb-4">
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.text }}
                    >
                        {t("settingsScreen.title")}
                    </Text>

                    <Text
                        className="mt-1 text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        {t("settingsScreen.subtitle")}
                    </Text>
                </View>
                
                <DefaultCard>
                    <LanguageSettings />

                    <View className="mt-6">
                        <ThemeSettings />
                    </View>

                    <View className="mt-6">
                        <LogoutSettings />
                    </View>
                </DefaultCard>

            </View>
        </View>
    );
}