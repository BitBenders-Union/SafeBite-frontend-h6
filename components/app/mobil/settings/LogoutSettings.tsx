// /components/app/mobil/settings/LogoutSettings.tsx
import { useAuth } from "@/lib/auth/AuthContext";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export function LogoutSettings() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("settings");
    const [loading, setLoading] = React.useState(false);
    const { signOut } = useAuth();

    const performLogout = async () => {
        try {
            setLoading(true);

            await signOut();

        } finally {
            setLoading(false);
        }
    };

    return (
        <View>
            <Text className="mb-3 text-lg font-semibold" style={{ color: theme.text }}>
                {t("logoutTitle")}
            </Text>

            <TouchableOpacity
                onPress={performLogout}
                disabled={loading}
                className="rounded-xl py-3"
                style={{ backgroundColor: theme.dangerSolid }}
                activeOpacity={0.8}
            >
                <Text className="text-center text-base font-semibold text-white">
                    {loading ? t("logoutLoading") : t("logoutButton")}
                </Text>
            </TouchableOpacity>
        </View>
    );
}