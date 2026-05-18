import { useAppTheme } from "@/lib/theme/useAppTheme";
import type { DetectedAllergy, MatchedIngredient, ScanHistoryParameters, ScanHistoryResponseDTO } from "@/lib/types/scan";
import { getMyScanHistory } from "@/services/api/scanApi";
import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, ScrollView, Text, View, useWindowDimensions } from "react-native";
import { DefaultCard } from "../../../components/Shared/DefaultCard";

/**
 * Format dato to more readable format
 */
function formatDate(dateString: string) {
    const d = new Date(dateString);
    return d.toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

/**
 * I split the scan data into pages (chunks) for swipe viewing
 */
function chunkData<T>(items: T[], itemsPerPage: number) {
    const paginatedChunks: T[][] = [];

    for (let offset = 0; offset < items.length; offset += itemsPerPage) {
        const page = items.slice(offset, offset + itemsPerPage);
        paginatedChunks.push(page);
    }

    return paginatedChunks;
}

export default function Home() {
    const { t } = useTranslation("home");
    const { theme } = useAppTheme();
    const { width } = useWindowDimensions();

    const cardContentWidth = width - 32;

    const [scans, setScans] = useState<ScanHistoryResponseDTO[]>([]);
    const [allergenScans, setAllergenScans] = useState<ScanHistoryResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
    const controller = new AbortController();
    const signal = controller.signal;

        async function fetchScans(signal?: AbortSignal) {            
            try {
                setIsLoading(true);
                setError(null);

                const baseParams: ScanHistoryParameters = {
                    currentPage: 1,
                    pageSize: 6,
                };

                const [recentRes, allergyRes] = await Promise.all([
                    getMyScanHistory(baseParams, signal),
                    getMyScanHistory({ ...baseParams, ContainsAllergies: true }, signal)
                ]);

                if (recentRes) {
                    const scanList = recentRes.data || [];
                    setScans(scanList);
                } else {
                    setError(t("scanLoadError"));
                }

                if (allergyRes) {
                    const allergyList = allergyRes.data || [];
                    setAllergenScans(allergyList);
                }
            } catch (err) {
                if (axios.isCancel(err)) return;

                console.error("Error loading home scans", err);
                setError(t("scanLoadError"));
            } finally {
                setIsLoading(false);
            }
        }

        fetchScans();
        return () => { controller.abort() };        
    }, [t]);

    const pagedAllScans = useMemo(() => chunkData(scans, 3), [scans]);
    const pagedAllergenScans = useMemo(() => chunkData(allergenScans, 3), [allergenScans]);

    function renderNoScansText() {
        return (
            <Text className="py-4 text-center text-sm" style={{ color: theme.textMuted }}>
                {t("noScansRecorded")}
            </Text>
        );
    }

    const renderScanRow = (scan: ScanHistoryResponseDTO, index: number) => {
        const allergyNames = scan.detectedAllergies?.map((da: DetectedAllergy) => da.allergyName) ?? [];

        return (
            <View key={scan.id}>
                {index > 0 && (
                    <View className="h-[1px]" style={{ backgroundColor: theme.borderSoft }} />
                )}
                <View className="py-3">
                    <Text className="mb-1 text-xs" style={{ color: theme.textMuted }}>
                        📅 {formatDate(scan.scannedAt)}
                    </Text>

                    {allergyNames.length > 0 ? (
                        <Text className="text-sm font-semibold" style={{ color: theme.dangerText }}>
                            ⚠️ {t("allergenLabel")}: {allergyNames.join(", ")}
                        </Text>
                    ) : (
                        <Text className="text-sm font-semibold" style={{ color: theme.successText }}>
                            ✅ {t("noAllergensFound")}
                        </Text>
                    )}
                </View>
            </View>
        );
    };

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
        >
            {/* SENESTE SCANNINGER */}
            <DefaultCard>
                <Text className="mb-2 text-base font-bold uppercase tracking-wide" style={{ color: theme.text }}>
                    {t("latestScansTitle")}
                </Text>
                <Text className="mb-4 text-sm" style={{ color: theme.textMuted }}>
                    {t("latestScansSubtitle")}
                </Text>

                {isLoading ? (
                    <View className="items-center justify-center py-6">
                        <ActivityIndicator color={theme.buttonPrimaryBg} />
                    </View>
                ) : error ? (
                    <Text className="mb-2 text-sm" style={{ color: theme.dangerText }}>{error}</Text>
                ) : scans.length === 0 ? (
                    renderNoScansText()
                ) : (
                    <>
                        <FlatList
                            data={pagedAllScans}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={{ width: cardContentWidth }}>
                                    {item.map((scan, idx) => renderScanRow(scan, idx))}
                                </View>
                            )}
                        />
                        <Text className="mt-3 text-right text-xs" style={{ color: theme.textMuted }}>
                            {t("swipeToSeeMore")}
                        </Text>
                    </>
                )}
            </DefaultCard>

            <View className="h-4" />

            {/* RISIKO SCANNINGER (KUN ALLERGIER) */}
            <DefaultCard>
                <Text className="mb-2 text-base font-bold uppercase tracking-wide" style={{ color: theme.text }}>
                    {t("recentRiskScansTitle")}
                </Text>
                <Text className="mb-4 text-sm" style={{ color: theme.textMuted }}>
                    {t("recentRiskScansSubtitle")}
                </Text>

                {isLoading ? (
                    <View className="items-center justify-center py-6">
                        <ActivityIndicator color={theme.buttonPrimaryBg} />
                    </View>
                ) : allergenScans.length === 0 ? (
                    renderNoScansText()
                ) : (
                    <>
                        <FlatList
                            data={pagedAllergenScans}
                            keyExtractor={(_, index) => index.toString()}
                            horizontal
                            pagingEnabled
                            showsHorizontalScrollIndicator={false}
                            renderItem={({ item }) => (
                                <View style={{ width: cardContentWidth }}>
                                    {item.map((scan, idx) => {
                                        const matchedIngredients = scan.detectedAllergies?.flatMap(
                                            (da: DetectedAllergy) =>
                                                da.matchedIngredients.map((mi: MatchedIngredient) => mi.ingredientText)
                                        ) ?? [];

                                        const uniqueIngredients = Array.from(new Set(matchedIngredients));

                                        return (
                                            <View key={scan.id}>
                                                {renderScanRow(scan, idx)}
                                                {uniqueIngredients.length > 0 && (
                                                    <Text className="mt-[-4px] pb-3 text-sm" style={{ color: theme.text }}>
                                                        🧂 {t("ingredientsLabel")}: {uniqueIngredients.join(", ")}
                                                    </Text>
                                                )}
                                            </View>
                                        );
                                    })}
                                </View>
                            )}
                        />
                        <Text className="mt-3 text-right text-xs" style={{ color: theme.textMuted }}>
                            {t("swipeToSeeMore")}
                        </Text>
                    </>
                )}
            </DefaultCard>
        </ScrollView>
    );
}