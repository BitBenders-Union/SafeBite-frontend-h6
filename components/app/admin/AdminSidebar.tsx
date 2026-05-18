// /components/app/admin/AdminSidebar.tsx

import { useAuth } from "@/lib/auth/AuthContext";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Platform, Text, TouchableOpacity, View } from "react-native";

type SidebarItem = {
    label: string;
    icon: keyof typeof Ionicons.glyphMap;
    href: Href;
};

const sidebarItems: SidebarItem[] = [
    {
        label: "Dashboard",
        icon: "grid-outline",
        href: "/(app)/(admin)/adminHome",
    },
    {
        label: "Users",
        icon: "people-outline",
        href: "/(app)/(admin)/adminUsers",
    },
    {
        label: "Allergies",
        icon: "cube-outline",
        href: "/(app)/(admin)/adminAllergies",
    },
    {
        label: "Settings",
        icon: "settings-outline",
        href: "/(app)/(admin)/adminSettings",
    }
];

export default function AdminSidebar() {
    const { t } = useTranslation("adminsidebar");
    const router = useRouter();
    const pathname = usePathname();
    const { theme } = useAppTheme();
    const { signOut } = useAuth();

    if (Platform.OS !== "web") {
        return null;
    }

    return (
        <View
            style={{
                width: 260,
                backgroundColor: theme.card,
                borderRightWidth: 1,
                borderRightColor: theme.borderSoft,
                paddingHorizontal: 16,
                paddingTop: 24,
                paddingBottom: 16,
            }}
        >
            <View style={{ marginBottom: 24 }}>
                <Text
                    style={{
                        color: theme.text,
                        fontSize: 22,
                        fontWeight: "700",
                    }}
                >
                    {t("sidebar.appTitle")}
                </Text>

                <Text
                    style={{
                        color: theme.textMuted,
                        fontSize: 13,
                        marginTop: 4,
                    }}
                >
                    {t("sidebar.controlPanel")}
                </Text>
            </View>

            <View style={{ flex: 1, gap: 8 }}>
                {sidebarItems.map((item) => {
                    const isActive = pathname === item.href;

                    const translationKey = `sidebar.${item.label.toLowerCase()}`;

                    return (
                        <TouchableOpacity
                            key={item.label}
                            onPress={() => router.push(item.href)}
                            activeOpacity={0.8}
                            style={{
                                flexDirection: "row",
                                alignItems: "center",
                                gap: 12,
                                paddingHorizontal: 12,
                                paddingVertical: 12,
                                borderRadius: 12,
                                backgroundColor: isActive
                                    ? theme.surfaceStrong
                                    : "transparent",
                                borderWidth: 1,
                                borderColor: isActive
                                    ? theme.borderStrong
                                    : "transparent",
                            }}
                        >
                            <Ionicons
                                name={item.icon}
                                size={20}
                                color={isActive ? theme.text : theme.textMuted}
                            />

                            <Text
                                style={{
                                    color: isActive
                                        ? theme.text
                                        : theme.textMuted,
                                    fontSize: 15,
                                    fontWeight: isActive ? "700" : "500",
                                }}
                            >
                                {t(translationKey, item.label)}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>

            <TouchableOpacity
                onPress={() => router.push("/(app)/mobil/home")}
                activeOpacity={0.8}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 10,
                    backgroundColor: theme.activeSoft,
                    marginBottom: 20,
                }}
            >
                <Ionicons
                    name="arrow-back-outline"
                    size={18}
                    color={theme.active}
                />

                <Text
                    style={{
                        color: theme.active,
                        fontWeight: "600",
                    }}
                >
                    {t("sidebar.userView")}
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={signOut}
                activeOpacity={0.8}
                style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.dangerBorder,
                    backgroundColor: theme.dangerBg,
                    marginTop: 16,
                }}
            >
                <Ionicons
                    name="log-out-outline"
                    size={20}
                    color={theme.dangerText}
                />

                <Text
                    style={{
                        color: theme.dangerText,
                        fontSize: 15,
                        fontWeight: "600",
                    }}
                >
                    {t("sidebar.logout")}
                </Text>
            </TouchableOpacity>
        </View>
    );
}