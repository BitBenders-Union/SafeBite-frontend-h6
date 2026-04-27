// /app/(app)/(admin)/adminUsers.tsx
import AdminUserSection from "@/components/app/admin/users/AdminUserSection";
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { Text, View } from "react-native";

export default function AdminUsers() {
    const { theme } = useAppTheme();

    return (
    <View className="flex-1 px-6 pt-12 items-center">
        <View className="w-full max-w-[1100px] flex-1">
            <View className="mb-4">
                <Text className="text-2xl font-bold" style={{ color: theme.text }}>
                    Users
                </Text>

                <Text className="mt-1 text-sm" style={{ color: theme.textMuted }}>
                    Manage admin access and user status.
                </Text>
            </View>

            <DefaultCard className="flex-1">
                <AdminUserSection />
            </DefaultCard>
        </View>
    </View>
);
}