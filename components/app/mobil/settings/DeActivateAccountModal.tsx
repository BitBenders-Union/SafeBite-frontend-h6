// /components/app/mobil/settings/DeActivateAccountModal.tsx

import { useAppTheme } from "@/lib/theme/ThemeProvider";
import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, Text, TouchableOpacity, View } from "react-native";

type Props = {
    visible: boolean;
    loading?: boolean;
    error?: string;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function DeActivateAccountModal({
    visible,
    loading = false,
    error,
    onCancel,
    onConfirm,
}: Props) {
    const { t } = useTranslation("settings");
    const { theme } = useAppTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View
                className="flex-1 items-center justify-center px-4"
                style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            >
                <View
                    className="w-full max-w-[500px] rounded-2xl border p-5"
                    style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    }}
                >
                    <Text
                        className="text-xl font-bold"
                        style={{ color: theme.text }}
                    >
                        {t("deActivateAccountTitle")}
                    </Text>

                    <Text
                        className="mt-2 text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        {t("deActivateAccountConfirmText")}
                    </Text>

                    {error ? (
                        <Text
                            className="mt-4 text-sm"
                            style={{ color: theme.dangerText }}
                        >
                            {error}
                        </Text>
                    ) : null}

                    <View className="mt-6 flex-row justify-end gap-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            disabled={loading}
                            className="rounded-xl px-4 py-3"
                            style={{ backgroundColor: theme.surfaceSoft }}
                        >
                            <Text style={{ color: theme.text }}>
                                {t("cancel")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            disabled={loading}
                            className="rounded-xl px-4 py-3"
                            style={{
                                backgroundColor: theme.dangerSolid,
                                opacity: loading ? 0.6 : 1,
                            }}
                        >
                            <Text
                                style={{
                                    color: theme.dangerSolidText,
                                    fontWeight: "600",
                                }}
                            >
                                {loading
                                    ? t("loading")
                                    : t("deActivateAccountButton")}
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}