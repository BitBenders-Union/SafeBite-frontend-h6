// /components/app/mobil/userProfile/UserScanHistory.tsx
// User scan history component.

import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ScrollView,
    Text,
    TextInput,
    View,
} from "react-native";

import { useAppTheme } from "@/lib/theme/ThemeProvider";

export type ScanSeverity = "mild" | "moderate" | "severe";

export type ScanHistoryItem = {
    id: number;
    date: string;
    allergens: string;
    matches?: string;
    severity: ScanSeverity;
};

type UserScanHistoryProps = {
    historyItems: ScanHistoryItem[];
    loading?: boolean;
    errorText?: string | null;
};

export default function UserScanHistory({
    historyItems,
    loading = false,
    errorText = null,
}: UserScanHistoryProps) {
    const { t } = useTranslation("profile");
    const { theme } = useAppTheme();

    const [search, setSearch] = useState("");

    const filteredHistory = useMemo(() => {
        const value = search.trim().toLowerCase();

        if (!value) return historyItems;

        return historyItems.filter((item) => {
            return (
                item.allergens.toLowerCase().includes(value) ||
                item.matches?.toLowerCase().includes(value) ||
                item.severity.toLowerCase().includes(value) ||
                item.date.toLowerCase().includes(value)
            );
        });
    }, [historyItems, search]);

    function getSeverityStyle(severity: ScanSeverity) {
        if (severity === "severe") {
            return {
                bg: theme.dangerSolid,
                text: theme.dangerSolidText,
                label: t("SeveritySevere", "Severe"),
            };
        }

        if (severity === "moderate") {
            return {
                bg: theme.warningBg,
                text: theme.warningText,
                label: t("SeverityModerate", "Moderate"),
            };
        }

        return {
            bg: theme.successBg,
            text: theme.successText,
            label: t("SeverityMild", "Mild"),
        };
    }

    return (
        <View className="w-full">
            <View className="mb-1 flex-row items-center">
                <View className="flex-1">
                    <Text
                        className="text-lg font-semibold"
                        style={{ color: theme.text }}
                    >
                        {t("HistoryTitle", "Scan history")}
                    </Text>

                    <Text
                        className="text-xs"
                        style={{ color: theme.textMuted }}
                    >
                        {t("HistorySubtitle", "See your previous scan results")}
                    </Text>
                </View>
            </View>

            <View
                className="mb-4 mt-3 flex-row items-center rounded-full px-4 py-2"
                style={{
                    backgroundColor: theme.inputBg,
                    borderWidth: 1,
                    borderColor: theme.inputBorder,
                }}
            >
                <Ionicons
                    name="search"
                    size={18}
                    color={theme.textMuted}
                />

                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t("SearchHistory", "Search history")}
                    placeholderTextColor={theme.textPlaceholder}
                    className="ml-2 flex-1 text-sm"
                    style={{ color: theme.text }}
                />
            </View>

            <View
                className="max-h-96 rounded-2xl " >
                {loading ? (
                    <View className="items-center justify-center py-8">
                        <Text style={{ color: theme.textMuted }}>
                            {t("LoadingHistory", "Loading history...")}
                        </Text>
                    </View>
                ) : errorText ? (
                    <Text
                        className="text-center text-sm"
                        style={{ color: theme.dangerText }}
                    >
                        {errorText}
                    </Text>
                ) : filteredHistory.length === 0 ? (
                    <Text
                        className="text-center text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        {t("NoHistoryFound", "No scan history found")}
                    </Text>
                ) : (
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled
                        keyboardShouldPersistTaps="handled"
                    >
                        {filteredHistory.map((item) => {
                            const severityStyle = getSeverityStyle(item.severity);

                            return (
                                <View
                                    key={item.id}
                                    className="mb-3 rounded-xl px-4 py-3"
                                    style={{
                                        backgroundColor: theme.surfaceSoft,
                                        borderWidth: 1,
                                        borderColor: theme.borderSoft,
                                    }}
                                >
                                    <View className="mb-2 flex-row items-center justify-between">
                                        <Text
                                            className="mr-3 flex-1 text-[13px] font-semibold"
                                            style={{ color: theme.text }}
                                        >
                                            {item.date}
                                        </Text>

                                        <View
                                            className="rounded-full px-3 py-1"
                                            style={{ backgroundColor: severityStyle.bg }}
                                        >
                                            <Text
                                                className="text-[11px] font-semibold"
                                                style={{ color: severityStyle.text }}
                                            >
                                                {severityStyle.label}
                                            </Text>
                                        </View>
                                    </View>

                                    <Text
                                        className="text-[14px]"
                                        style={{ color: theme.text }}
                                    >
                                        {item.allergens}
                                    </Text>

                                    {item.matches ? (
                                        <Text
                                            className="mt-1 text-[12px]"
                                            style={{ color: theme.textMuted }}
                                        >
                                            {t("Matches", "Matches:")}{" "}
                                            <Text style={{ color: theme.text }}>
                                                {item.matches}
                                            </Text>
                                        </Text>
                                    ) : null}
                                </View>
                            );
                        })}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}