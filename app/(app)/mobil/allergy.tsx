// /app(app)/mobil/allergy.tsx
import AllergyListView from "@/components/app/mobil/allergy/AllergySection";
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text } from "react-native";

export default function AllergyPage() {
    const { t } = useTranslation("allergy");
    const { theme } = useAppTheme();

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
        >
            <DefaultCard className="px-5 py-5">
                <Text
                    className="mb-1 text-2xl font-bold"
                    style={{ color: theme.text }}
                >
                    {t("manageTitle")}
                </Text>

                <Text
                    className="mb-4 text-sm"
                    style={{ color: theme.textMuted }}
                >
                    {t("manageSubtitle")}
                </Text>

                <AllergyListView />
            </DefaultCard>
        </ScrollView>
    );
}