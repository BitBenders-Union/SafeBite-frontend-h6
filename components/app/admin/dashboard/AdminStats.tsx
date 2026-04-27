// /components/app/admin/dashboard/AdminStats.tsx
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, View } from "react-native";

type Props = {
    users: number;
    allergies: number;
    scans: number;
};

export default function AdminStats({ users, allergies, scans }: Props) {
    const { theme } = useAppTheme();

    return (
        <View className="mb-6 flex-row gap-3">
            <DefaultCard className="flex-1 items-center py-5">
                <View
                    className="mb-2 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.activeSoft }}
                >
                    <Ionicons name="people-outline" size={20} color={theme.active} />
                </View>

                <Text className="text-2xl font-bold" style={{ color: theme.active }}>
                    {users}
                </Text>

                <Text className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    Registered Users
                </Text>
            </DefaultCard>

            <DefaultCard className="flex-1 items-center py-5">
                <View
                    className="mb-2 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.warningBg }}
                >
                    <Ionicons name="warning-outline" size={20} color={theme.warningText} />
                </View>

                <Text className="text-2xl font-bold" style={{ color: theme.warningText }}>
                    {allergies}
                </Text>

                <Text className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    Total Allergies
                </Text>
            </DefaultCard>

            <DefaultCard className="flex-1 items-center py-5">
                <View
                    className="mb-2 h-10 w-10 items-center justify-center rounded-full"
                    style={{ backgroundColor: theme.successBg }}
                >
                    <Ionicons name="scan-outline" size={20} color={theme.successText} />
                </View>

                <Text className="text-2xl font-bold" style={{ color: theme.successText }}>
                    {scans}
                </Text>

                <Text className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    Scans Performed
                </Text>
            </DefaultCard>
        </View>
    );
}