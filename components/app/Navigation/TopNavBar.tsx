// components/common/headerbar.tsx

import { useAuth } from "@/lib/auth/AuthContext";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { Platform, Text, TouchableOpacity, View } from "react-native";

export default function HeaderBar() {
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useAppTheme();
    const { user } = useAuth();

    const isSettings = pathname === "/mobil/settings";
    const isProfile = pathname === "/mobil/userProfile";
    const isWeb = Platform.OS === "web";

    const isAdmin =
        user?.roles?.includes("admin") ||
        user?.roles?.includes("Admin");

    return (
        <View className="pt-2 pb-1">
            <View
                className="mx-4 flex-row items-center justify-between rounded-3xl border px-4 py-2"
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    shadowColor: theme.shadowCard.color,
                    shadowOpacity: theme.shadowCard.opacity,
                    shadowRadius: theme.shadowCard.radius,
                    shadowOffset: theme.shadowCard.offset,
                }}
            >
                <TouchableOpacity
                    onPress={() => {
                        if (!isSettings) router.push("/(app)/mobil/setting");
                    }}
                    activeOpacity={0.7}
                    className="rounded-full p-1.5"
                    style={{
                        backgroundColor: isSettings ? theme.activeSoft : "transparent",
                    }}
                >
                    <Ionicons
                        name="settings-sharp"
                        size={24}
                        color={isSettings ? theme.active : theme.text}
                    />
                </TouchableOpacity>

                {isAdmin && isWeb && (
                    <TouchableOpacity
                        onPress={() => router.push("/(app)/(admin)/adminHome")}
                        className="rounded-xl px-3 py-1"
                        style={{
                            backgroundColor: theme.activeSoft,
                        }}
                    >
                        <Text style={{ color: theme.active }}>
                            Admin
                        </Text>
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    onPress={() => {
                        if (!isProfile) router.push("/mobil/userProfile");
                    }}
                    activeOpacity={0.7}
                    className="rounded-full p-1.5"
                    style={{
                        backgroundColor: isProfile ? theme.activeSoft : "transparent",
                    }}
                >
                    <FontAwesome
                        name="user-circle"
                        size={24}
                        color={isProfile ? theme.active : theme.text}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
}