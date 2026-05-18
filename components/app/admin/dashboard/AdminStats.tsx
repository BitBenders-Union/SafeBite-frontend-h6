// /components/app/admin/dashboard/AdminStats.tsx
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, View } from "react-native";

type StatState = {
    value: number | undefined;
    isLoading: boolean;
    error: string;
};

type Props = {
    users: StatState;
    allergies: StatState;
    scans: StatState;
};

export default function AdminStats({ users, allergies, scans }: Props) {
    const { t } = useTranslation("adminhome");
    const { theme } = useAppTheme();

    return (
        <View className="mb-6 flex-row gap-3">
            {/* Users Card */}
            <DefaultCard className="flex-1 items-center py-5">
                <View
                    className="mb-2 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.activeSoft }}
                >
                    <Ionicons name="people-outline" size={20} color={theme.active} />
                </View>

                {users.isLoading ? (
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.active }}
                    >
                        ...
                    </Text>
                ) : users.error ? (
                    <Text
                        className="text-sm font-medium"
                        style={{ color: theme.dangerText }}
                    >
                        {t("error")}
                    </Text>
                ) : (
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.active }}
                    >
                        {users.value}
                    </Text>
                )}

                <Text className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    {t("registeredUsers")}
                </Text>
            </DefaultCard>

            {/* Allergies Card */}
            <DefaultCard className="flex-1 items-center py-5">
                <View
                    className="mb-2 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.warningBg }}
                >
                    <Ionicons name="warning-outline" size={20} color={theme.warningText} />
                </View>

                {allergies.isLoading ? (
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.active }}
                    >
                        ...
                    </Text>
                ) : allergies.error ? (
                    <Text
                        className="text-sm font-medium"
                        style={{ color: theme.dangerText }}
                    >
                        {t("error")}
                    </Text>
                ) : (
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.active }}
                    >
                        {allergies.value}
                    </Text>
                )}

                <Text className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    {t("totalAllergies")}
                </Text>
            </DefaultCard>

            {/* Scans Card */}
            <DefaultCard className="flex-1 items-center py-5">
                <View
                    className="mb-2 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.successBg }}
                >
                    <Ionicons name="scan-outline" size={20} color={theme.successText} />
                </View>

                {scans.isLoading ? (
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.active }}
                    >
                        ... 
                    </Text>
                ) : scans.error ? (
                    <Text
                        className="text-sm font-medium"
                        style={{ color: theme.dangerText }}
                    >
                        {t("error")}
                    </Text>
                ) : (
                    <Text
                        className="text-2xl font-bold"
                        style={{ color: theme.active }}
                    >
                        {scans.value}
                    </Text>
                )}

                <Text className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    {t("scansPerformed")}
                </Text>
            </DefaultCard>
        </View>
    );
}