import DeActivateAccountModal from "@/components/app/mobil/settings/DeActivateAccountModal";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAppTheme } from "@/lib/theme/ThemeProvider";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

export default function DeActivateAccountButton() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("settings");
    const { deactivateUser } = useAuth();

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [error, setError] = useState("");

    async function handleDeactivate() {
        try {
            setLoading(true);
            setError("");

            await deactivateUser();

            console.log("User deactivated successfully");
        } catch (error) {
            console.error("Deactivate account error:", error);

            setError(t("deActivateAccountError"));
        } finally {
            setLoading(false);
        }
    }

    return (
        <>
            <DeActivateAccountModal
                visible={modalVisible}
                loading={loading}
                error={error}
                onCancel={() => {
                    if (loading) return;

                    setModalVisible(false);
                    setError("");
                }}
                onConfirm={handleDeactivate}
            />

            <View>
                <Text
                    className="mb-3 text-lg font-semibold"
                    style={{ color: theme.text }}
                >
                    {t("deActivateAccountTitle")}
                </Text>

                <View
                    className="w-full rounded-2xl px-4 py-4"
                    style={{
                        backgroundColor: theme.surface,
                        borderWidth: 1,
                        borderColor: theme.dangerBorder,
                    }}
                >
                    <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        disabled={loading}
                        activeOpacity={0.8}
                        className="rounded-xl px-4 py-3"
                        style={{
                            backgroundColor: theme.dangerSolid,
                            opacity: loading ? 0.6 : 1,
                        }}
                    >
                        <Text
                            className="text-center font-semibold"
                            style={{ color: theme.dangerSolidText }}
                        >
                            {loading
                                ? t("loading")
                                : t("deActivateAccountButton")}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </>
    );
}