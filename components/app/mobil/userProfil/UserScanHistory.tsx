// /components/app/mobil/userProfile/UserScanHistory.tsx
import { Ionicons } from "@expo/vector-icons";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, Text, TextInput, TouchableOpacity, View, ActivityIndicator } from "react-native";
import { useAppTheme } from "@/lib/theme/ThemeProvider";

export type ScanHistoryItem = {
    id: string | number;
    date: string;
    allergens: string;
    matches?: string; 
};

type UserScanHistoryProps = {
    historyItems: ScanHistoryItem[];
    loading?: boolean;
    errorText?: string | null;
    onLoadMore?: () => void;
    onSearch?: (text: string) => void;
};

export default function UserScanHistory({
    historyItems,
    loading = false,
    errorText = null,
    onLoadMore,
    onSearch,
}: UserScanHistoryProps) {
    const { t } = useTranslation("profile");
    const { theme } = useAppTheme();
    const [search, setSearch] = useState("");
    const [expandedItems, setExpandedItems] = useState<Record<string | number, boolean>>({});

    useEffect(() => {
        const handler = setTimeout(() => {
            if (onSearch) {
                onSearch(search);
            }
        }, 750); // 750ms delay

        return () => clearTimeout(handler);
    }, [search, onSearch]);

    const toggleExpand = (id: string | number) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleScroll = (event: any) => {
        const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
        const isCloseToBottom = layoutMeasurement.height + contentOffset.y >= contentSize.height - 50;

        if (isCloseToBottom && !loading) {
            onLoadMore?.();
        }
    };

    return (
        <View className="w-full">
            <View className="mb-1 flex-row items-center">
                <View className="flex-1">
                    <Text className="text-lg font-semibold" style={{ color: theme.text }}>
                        {t("HistoryTitle")}
                    </Text>
                    <Text className="text-xs" style={{ color: theme.textMuted }}>
                        {t("HistorySubtitle")}
                    </Text>
                </View>
            </View>

            {/* Search field Lokale State*/}
            <View className="mb-4 mt-3 flex-row items-center rounded-full px-4 py-2" style={{ backgroundColor: theme.inputBg, borderWidth: 1, borderColor: theme.inputBorder }}>
                <Ionicons name="search" size={18} color={theme.textMuted} />
                <TextInput
                    value={search}
                    onChangeText={setSearch}
                    placeholder={t("SearchHistory")}
                    placeholderTextColor={theme.textPlaceholder}
                    className="ml-2 flex-1 text-sm"
                    style={{ color: theme.text }}
                />
            </View>

            <View className="max-h-96 rounded-2xl">
                {errorText ? (
                    <Text className="text-center text-sm" style={{ color: theme.dangerText }}>{errorText}</Text>
                ) : historyItems.length === 0 && !loading ? (
                    <Text className="text-center text-sm" style={{ color: theme.textMuted }}>{t("NoHistoryFound")}</Text>
                ) : (
                    <ScrollView 
                        showsVerticalScrollIndicator={false} 
                        nestedScrollEnabled
                        onScroll={handleScroll}
                        scrollEventThrottle={16}
                    >
                        {/* We use historyItems directly from props, as they are now filtered by the API */}
                        {historyItems.map((item) => {
                            const hasAllergies = item.allergens && item.allergens !== t("NoAllergensFound");
                            const isExpanded = expandedItems[item.id];

                            return (
                                <View key={item.id} className="mb-3 rounded-xl px-4 py-3" style={{ backgroundColor: theme.surfaceSoft, borderWidth: 1, borderColor: theme.borderSoft }}>
                                    <View className="mb-2 flex-row items-center justify-between">
                                        <Text className="text-[11px] font-medium" style={{ color: theme.textMuted }}>{item.date}</Text>
                                    </View>
                                    <Text className="text-[15px] font-bold" style={{ color: hasAllergies ? theme.dangerSolid : theme.successText }}>
                                        {hasAllergies ? item.allergens : t("NoAllergensFound")}
                                    </Text>

                                    {item.matches && (
                                        <View className="mt-3 border-t pt-2" style={{ borderColor: theme.borderSoft }}>
                                            <TouchableOpacity onPress={() => toggleExpand(item.id)} className="flex-row items-center">
                                                <Text className="text-[12px] font-semibold" style={{ color: theme.text }}>
                                                    {isExpanded ? t("HideIngredients", "Skjul ingredienser") : t("ShowIngredients")}
                                                </Text>
                                                <Ionicons name={isExpanded ? "chevron-up" : "chevron-down"} size={14} color={theme.text} style={{ marginLeft: 4 }} />
                                            </TouchableOpacity>
                                            {isExpanded && (
                                                <View className="mt-2 p-2 rounded-lg" style={{ backgroundColor: theme.inputBg }}>
                                                    <Text className="text-[11px] font-bold mb-1" style={{ color: theme.textMuted }}>{t("IngredientList")}</Text>
                                                    <Text className="text-[12px] leading-4" style={{ color: theme.text }}>{item.matches}</Text>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            );
                        })}
                        {loading && (
                            <View className="py-4">
                                <ActivityIndicator size="small" color={theme.text} />
                            </View>
                        )}
                    </ScrollView>
                )}
            </View>
        </View>
    );
}