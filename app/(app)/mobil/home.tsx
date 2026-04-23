// /app/(app)/home.tsx
// Home screen with mocked scan history.
// Shows recent scans and recent allergen-related scans.

import { useAppTheme } from "@/lib/theme/useAppTheme";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    ScrollView,
    Text,
    View,
    useWindowDimensions
} from "react-native";
import { DefaultCard } from "../../../components/Shared/DefaultCard";



type NamedItem = {
    id: string;
    name: string;
};

type ScanHistoryParameters = {
    currentPage: number;
    pageSize: number;
    orderDescending?: boolean;
    containsAllergies?: boolean;
};

type ScanHistoryResponseDTO = {
    id: string;
    createdAt: string;
    severityLevel?: string | null;
    allergies?: NamedItem[];
    customAllergies?: NamedItem[];
    crossReactions?: NamedItem[];
    flaggedIngredients?: NamedItem[];
};

type ScanHistoryResult = {
    isSuccess: boolean;
    data: ScanHistoryResponseDTO[];
    message?: string;
};

const mockScans: ScanHistoryResponseDTO[] = [
    {
        id: "1",
        createdAt: "2026-03-24T08:15:00",
        severityLevel: "High",
        allergies: [{ id: "a1", name: "Milk" }],
        customAllergies: [],
        crossReactions: [],
        flaggedIngredients: [
            { id: "f1", name: "Whey powder" },
            { id: "f2", name: "Skimmed milk powder" },
        ],
    },
    {
        id: "2",
        createdAt: "2026-03-23T18:42:00",
        severityLevel: null,
        allergies: [],
        customAllergies: [],
        crossReactions: [],
        flaggedIngredients: [],
    },
    {
        id: "3",
        createdAt: "2026-03-22T13:10:00",
        severityLevel: "Moderate",
        allergies: [{ id: "a2", name: "Peanut" }],
        customAllergies: [{ id: "c1", name: "Hazelnut" }],
        crossReactions: [],
        flaggedIngredients: [{ id: "f3", name: "Ground nuts" }],
    },
    {
        id: "4",
        createdAt: "2026-03-21T09:30:00",
        severityLevel: "Low",
        allergies: [],
        customAllergies: [],
        crossReactions: [{ id: "cr1", name: "Soy" }],
        flaggedIngredients: [{ id: "f4", name: "Soy lecithin" }],
    },
    {
        id: "5",
        createdAt: "2026-03-20T16:05:00",
        severityLevel: null,
        allergies: [],
        customAllergies: [],
        crossReactions: [],
        flaggedIngredients: [],
    },
    {
        id: "6",
        createdAt: "2026-03-19T11:25:00",
        severityLevel: "High",
        allergies: [{ id: "a3", name: "Egg" }],
        customAllergies: [],
        crossReactions: [],
        flaggedIngredients: [{ id: "f5", name: "Egg white powder" }],
    },
];



async function getMyScanHistory(
    params: ScanHistoryParameters
): Promise<ScanHistoryResult> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    let result = [...mockScans];

    if (params.containsAllergies) {
        result = result.filter((scan) => {
            const hasAllergies = (scan.allergies?.length ?? 0) > 0;
            const hasCustomAllergies = (scan.customAllergies?.length ?? 0) > 0;
            const hasCrossReactions = (scan.crossReactions?.length ?? 0) > 0;

            return hasAllergies || hasCustomAllergies || hasCrossReactions;
        });
    }

    if (params.orderDescending) {
        result.sort(
            (a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    } else {
        result.sort(
            (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
    }

    const start = (params.currentPage - 1) * params.pageSize;
    const end = start + params.pageSize;

    return {
        isSuccess: true,
        data: result.slice(start, end),
    };
}

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

function chunkData<T>(arr: T[], size: number) {
    const chunks: T[][] = [];

    for (let i = 0; i < arr.length; i += size) {
        chunks.push(arr.slice(i, i + size));
    }

    return chunks;
}

export default function Home() {
    const { t } = useTranslation("home");
    const { theme } = useAppTheme();
    const { width } = useWindowDimensions();

    const pageWidth = width - 32;

    const [scans, setScans] = useState<ScanHistoryResponseDTO[]>([]);
    const [allergenScans, setAllergenScans] = useState<ScanHistoryResponseDTO[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchScans() {
            try {
                setIsLoading(true);
                setError(null);

                const baseParams: ScanHistoryParameters = {
                    currentPage: 1,
                    pageSize: 5,
                    orderDescending: true,
                };

                const response = await getMyScanHistory(baseParams);

                if (response.isSuccess) {
                    setScans(response.data);
                } else {
                    setScans([]);
                    setError(response.message || t("scanLoadError"));
                }

                const allergyResponse = await getMyScanHistory({
                    ...baseParams,
                    containsAllergies: true,
                });

                if (allergyResponse.isSuccess) {
                    setAllergenScans(allergyResponse.data);
                } else {
                    setAllergenScans([]);
                }
            } catch (err) {
                console.log("Error loading home scans", err);
                setScans([]);
                setAllergenScans([]);
                setError(t("scanLoadError"));
            } finally {
                setIsLoading(false);
            }
        }

        fetchScans();
    }, [t]);

    const pagedAllScans = useMemo(() => {
        if (scans.length === 0) return [];
        return chunkData(scans, 3);
    }, [scans]);

    const pagedAllergenScans = useMemo(() => {
        if (allergenScans.length === 0) return [];
        return chunkData(allergenScans, 3);
    }, [allergenScans]);

    function getSeverityColor(severity: string | null | undefined) {
        if (!severity) return theme.textMuted;

        const severityValue = severity.toLowerCase();

        if (
            severityValue.includes("severe") ||
            severityValue.includes("high") ||
            severityValue.includes("høj")
        ) {
            return theme.dangerText;
        }

        if (
            severityValue.includes("moderate") ||
            severityValue.includes("moderat")
        ) {
            return theme.warningText;
        }

        return theme.textMuted;
    }

    function renderNoScansText() {
        return (
            <Text
                className="py-4 text-center text-sm"
                style={{ color: theme.textMuted }}
            >
                {t("noScansRecorded")}
            </Text>
        );
    }

    return (
        <ScrollView
            className="flex-1"
            contentContainerStyle={{ padding: 16, paddingBottom: 28 }}
            showsVerticalScrollIndicator={false}
        >
            <DefaultCard>
                <View className="mb-6">
                    <Text
                        className="mb-2 text-base font-bold uppercase tracking-wide"
                        style={{ color: theme.text }}
                    >
                        {t("latestScansTitle")}
                    </Text>

                    <Text
                        className="mb-4 text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        {t("latestScansSubtitle")}
                    </Text>

                    {isLoading ? (
                        <View className="items-center justify-center py-6">
                            <ActivityIndicator color={theme.buttonPrimaryBg} />
                        </View>
                    ) : error ? (
                        <Text
                            className="mb-2 text-sm"
                            style={{ color: theme.dangerText }}
                        >
                            {error}
                        </Text>
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
                                    <View style={{ width: pageWidth }}>
                                        {item.map((scan, index) => {
                                            const allergens = [
                                                ...(scan.allergies?.map((a) => a.name) ?? []),
                                                ...(scan.customAllergies?.map((c) => c.name) ?? []),
                                                ...(scan.crossReactions?.map((c) => c.name) ?? []),
                                            ];

                                            return (
                                                <View key={scan.id}>
                                                    {index > 0 && (
                                                        <View
                                                            className="h-[1px]"
                                                            style={{ backgroundColor: theme.borderSoft }}
                                                        />
                                                    )}

                                                    <View className="py-3">
                                                        <Text
                                                            className="mb-1 text-xs"
                                                            style={{ color: theme.textMuted }}
                                                        >
                                                            📅 {formatDate(scan.createdAt)}
                                                        </Text>

                                                        {allergens.length > 0 ? (
                                                            <Text
                                                                className="text-sm font-semibold"
                                                                style={{ color: theme.dangerText }}
                                                            >
                                                                ⚠️ {t("allergenLabel")}: {allergens.join(", ")}
                                                            </Text>
                                                        ) : (
                                                            <Text
                                                                className="text-sm font-semibold"
                                                                style={{ color: theme.successText }}
                                                            >
                                                                ✅ {t("noAllergensFound")}
                                                            </Text>
                                                        )}
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            />

                            <Text
                                className="mt-3 text-right text-xs"
                                style={{ color: theme.textMuted }}
                            >
                                {t("swipeToSeeMore")}
                            </Text>
                        </>
                    )}
                </View>
            </DefaultCard>

            <View className="h-4" />

            <DefaultCard>
                <View>
                    <Text
                        className="mb-2 text-base font-bold uppercase tracking-wide"
                        style={{ color: theme.text }}
                    >
                        {t("recentRiskScansTitle")}
                    </Text>

                    <Text
                        className="mb-4 text-sm"
                        style={{ color: theme.textMuted }}
                    >
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
                                    <View style={{ width: pageWidth }}>
                                        {item.map((scan, index) => {
                                            const allergens = [
                                                ...(scan.allergies?.map((a) => a.name) ?? []),
                                                ...(scan.customAllergies?.map((c) => c.name) ?? []),
                                                ...(scan.crossReactions?.map((c) => c.name) ?? []),
                                            ];

                                            const flaggedIngredients =
                                                scan.flaggedIngredients?.map((fi) => fi.name) ?? [];

                                            const severityText =
                                                scan.severityLevel ?? t("unknownSeverity");

                                            return (
                                                <View key={scan.id}>
                                                    {index > 0 && (
                                                        <View
                                                            className="h-[1px]"
                                                            style={{ backgroundColor: theme.borderSoft }}
                                                        />
                                                    )}

                                                    <View className="py-3">
                                                        <Text
                                                            className="mb-1 text-xs"
                                                            style={{ color: theme.textMuted }}
                                                        >
                                                            📅 {formatDate(scan.createdAt)}
                                                        </Text>

                                                        <Text
                                                            className="text-sm font-semibold"
                                                            style={{ color: theme.dangerText }}
                                                        >
                                                            ⚠️ {t("allergenLabel")}: {allergens.join(", ")}
                                                        </Text>

                                                        {flaggedIngredients.length > 0 && (
                                                            <Text
                                                                className="mt-1 text-sm"
                                                                style={{ color: theme.text }}
                                                            >
                                                                🧂 {t("ingredientsLabel")}:{" "}
                                                                {flaggedIngredients.join(", ")}
                                                            </Text>
                                                        )}

                                                        <Text
                                                            className="mt-1 text-sm font-semibold"
                                                            style={{
                                                                color: getSeverityColor(
                                                                    scan.severityLevel
                                                                ),
                                                            }}
                                                        >
                                                            🔥 {t("severityLabel")}: {severityText}
                                                        </Text>
                                                    </View>
                                                </View>
                                            );
                                        })}
                                    </View>
                                )}
                            />

                            <Text
                                className="mt-3 text-right text-xs"
                                style={{ color: theme.textMuted }}
                            >
                                {t("swipeToSeeMore")}
                            </Text>
                        </>
                    )}
                </View>                

            </DefaultCard>
        </ScrollView>
    );
}