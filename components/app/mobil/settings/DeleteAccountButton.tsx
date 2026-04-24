// /components/app/mobil/settings/DeleteAccountButton.tsx

import { useAppTheme } from "@/lib/theme/ThemeProvider";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    onDelete?: () => void;
};

export default function DeleteAccountButton({ onDelete }: Props) {
    const { theme } = useAppTheme();
    const { t } = useTranslation("settings");

    return (
        <View>
            <Text
                className="mb-3 text-lg font-semibold"
                style={{ color: theme.text }}
            >
                {t("deleteAccountTitle")}
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
                    onPress={onDelete}
                    activeOpacity={0.8}
                    className="rounded-xl px-4 py-3"
                    style={{ backgroundColor: theme.dangerSolid }}
                >
                    <Text
                        className="text-center font-semibold"
                        style={{ color: theme.dangerSolidText }}
                    >
                        {t("deleteAccountButton")}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}