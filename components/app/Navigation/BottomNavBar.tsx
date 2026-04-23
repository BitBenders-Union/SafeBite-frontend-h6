// components/common/navigationbar.tsx
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { usePathname, useRouter } from "expo-router";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type TabRoute = "/scan" | "/home" | "/allergy";

type TabConfig = {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    route: TabRoute;
};

export default function BottomNavbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { t } = useTranslation("navbars");
    const { theme } = useAppTheme();

    const tabs: TabConfig[] = [
        {
            icon: "barcode-outline",
            label: t("scanBottomNav"),
            route: "/scan",
        },
        {
            icon: "home",
            label: t("homeBottomNav"),
            route: "/home",
        },
        {
            icon: "warning-outline",
            label: t("allergyBottomNav"),
            route: "/allergy",
        },
    ];

    return (
        <View className="pt-1 pb-2">
            <View
                className="mx-4 flex-row items-center justify-around rounded-3xl border py-2"
                style={{
                    backgroundColor: theme.card,
                    borderColor: theme.border,
                    shadowColor: theme.shadowCard.color,
                    shadowOpacity: theme.shadowCard.opacity,
                    shadowRadius: theme.shadowCard.radius,
                    shadowOffset: theme.shadowCard.offset,
                }}
            >
                {tabs.map((tab) => {
                    const active = pathname === tab.route;

                    return (
                        <TouchableOpacity
                            key={tab.route}
                            onPress={() => {
                                if (!active) router.push(tab.route);
                            }}
                            activeOpacity={0.85}
                            className="items-center justify-center"
                        >
                            <View
                                className="items-center justify-center px-4 py-2"
                                style={{
                                    backgroundColor: active ? theme.activeSoft : "transparent",
                                    borderRadius: 999,
                                    overflow: "hidden",
                                    alignSelf: "center",
                                }}
                            >
                                <Ionicons
                                    name={tab.icon}
                                    size={active ? 24 : 22}
                                    color={active ? theme.active : theme.textMuted}
                                />

                                <Text
                                    className="mt-1 text-[11px] font-medium"
                                    style={{
                                        color: active ? theme.active : theme.textMuted,
                                    }}
                                >
                                    {tab.label}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}