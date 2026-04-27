// /components/app/admin/dashboard/AdminQuickLinks.tsx
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { useRouter } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

export default function AdminQuickLinks() {
    const { theme } = useAppTheme();
    const router = useRouter();

    return (
        <View className="flex-row gap-3">
            <TouchableOpacity
                onPress={() => router.push("/(app)/(admin)/adminUsers")}
                className="flex-1 rounded-xl px-4 py-3"
                style={{ backgroundColor: theme.activeSoft }}
            >
                <Text
                    className="text-center font-semibold"
                    style={{ color: theme.active }}
                >
                    Manage Users
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/(app)/(admin)/adminAllergies")}
                className="flex-1 rounded-xl px-4 py-3"
                style={{ backgroundColor: theme.activeSoft }}
            >
                <Text
                    className="text-center font-semibold"
                    style={{ color: theme.active }}
                >
                    Manage Allergies
                </Text>
            </TouchableOpacity>
        </View>
    );
}