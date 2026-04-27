// /app/(app)/(admin)/adminSettings.tsx
import { LanguageSettings } from "@/components/app/mobil/settings/LanguageSettings";
import { LogoutSettings } from "@/components/app/mobil/settings/LogoutSettings";
import { ThemeSettings } from "@/components/app/mobil/settings/ThemeSettings";
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { Text, View } from "react-native";

export default function AdminSettings() {
    const { theme } = useAppTheme();

    return (
        <View className="flex-1 px-6 pt-12 items-center">
            <View className="w-full max-w-[1100px]">                
                <View className="mb-4">
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.text }}
                    >
                        Settings
                    </Text>

                    <Text
                        className="mt-1 text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        Manage your admin preferences.
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