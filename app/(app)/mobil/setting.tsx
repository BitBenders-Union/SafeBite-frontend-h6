// app/(app)/settings.tsx
// Settings screen for the authenticated user.

// Provides access to application preferences such as theme,
// language selection, and account logout.
import DeActivateAccountButton from "@/components/app/mobil/settings/DeActivateAccountButton";
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, View } from "react-native";
import { LanguageSettings } from "../../../components/app/mobil/settings/LanguageSettings";
import { LogoutSettings } from "../../../components/app/mobil/settings/LogoutSettings";
import { ThemeSettings } from "../../../components/app/mobil/settings/ThemeSettings";

// Groups and displays user preference sections.
export default function Settings() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("settings");

    return (
        <ScrollView className="flex-1 px-4 pt-4 gap-4">   
            <DefaultCard>
                <LanguageSettings />

                <View className="mt-6">
                    <ThemeSettings />
                </View>

                <View className="mt-6">
                    <LogoutSettings />
                </View>

                <View className="mt-6">
                    <DeActivateAccountButton />
                </View>
                
            </DefaultCard>
        </ScrollView>
    );
}