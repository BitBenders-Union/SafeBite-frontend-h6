// /app/(app)/profile.tsx
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAppTheme } from "@/lib/theme/ThemeProvider";
import { getMyCustomAllergies, getMySelectedAllergies } from "@/services/api/allergyApi";
import { getMyScanHistory } from "@/services/api/scanApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from "react-native";
import UserAllergyList, { Allergen } from "../../../components/app/mobil/userProfil/UserAllergyList";
import UserScanHistory, { ScanHistoryItem } from "../../../components/app/mobil/userProfil/UserScanHistory";

type ProfileView = "buttons" | "allergies" | "history";

export default function UserProfile() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("profile");
    const { user, isLoading: authLoading } = useAuth();

    const [activeView, setActiveView] = useState<ProfileView>("buttons");
    const [userAllergens, setUserAllergens] = useState<Allergen[]>([]);
    const [isLoadingAllergies, setIsLoadingAllergies] = useState(false);
    
    const [historyItems, setHistoryItems] = useState<ScanHistoryItem[]>([]);
    const [isLoadingHistory, setIsLoadingHistory] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [historyCount, setHistoryCount] = useState<number>(0);
    const [isLoadingCount, setIsLoadingCount] = useState(false);

    const allergyCount = userAllergens.length;

    // Only fetches the allergies that the user has selected
useEffect(() => {
        if (!user) return;

        async function fetchAllAllergyData() {
            try {
                setIsLoadingAllergies(true);
                const [standardRes, customRes] = await Promise.all([
                    getMySelectedAllergies(),
                    getMyCustomAllergies()
                ]);
                
                // Map standard allergy
                const mappedStandard: Allergen[] = (standardRes || []).map((a: any) => ({
                    id: a.allergyId || a.id, 
                    name: a.allergyName || a.name || "Unknown",
                    icon: a.icon,
                    isCustom: false
                }));

                // Map custom allergy
                const mappedCustom: Allergen[] = (customRes || []).map((a: any) => ({
                    id: a.id,
                    name: a.name || "Custom Allergy",
                    icon: a.icon || "pencil-outline", 
                    isCustom: true
                }));

                // combines the two lists and sets the state
                setUserAllergens([...mappedStandard, ...mappedCustom]);

            } catch (error) {
                console.error("Fejl ved hentning af allergidata:", error);
            } finally {
                setIsLoadingAllergies(false);
            }
        }
        fetchAllAllergyData();
    }, [user]);

    // fetch History stats
    useEffect(() => {
        if (!user) return;
        async function fetchHistoryStats() {
            try {
                setIsLoadingCount(true);
                const res = await getMyScanHistory({ currentPage: 1, pageSize: 1 });
                if (res) setHistoryCount(res.totalCount ?? 0);
            } catch (error) {
                console.error("Kunne ikke hente historik-statistik:", error);
            } finally {
                setIsLoadingCount(false);
            }
        }
        fetchHistoryStats();
    }, [user]);

    const handleUpdateAllergens = (updated: Allergen[]) => {
        setUserAllergens(updated);
    };

    // fetches the users scan history
    const loadHistory = async (page: number) => {
        try {
            setIsLoadingHistory(true);
            const res = await getMyScanHistory({ currentPage: page, pageSize: 20 });

            if (res && res.data) {
                const mappedItems: ScanHistoryItem[] = res.data.map(item => ({
                    id: item.id,
                    date: new Date(item.scannedAt).toLocaleDateString(),
                    allergens: item.detectedAllergies.length > 0 
                        ? item.detectedAllergies.map(allergy => allergy.allergyName).join(", ")
                        : t("NoAllergensFound"),
                    matches: item.scannedIngredientsText || ""
                }));

                setHistoryItems(prev => page === 1 ? mappedItems : [...prev, ...mappedItems]);
                setHistoryCount(res.totalCount ?? 0);
                if (res.data.length < 20) setHasMore(false);
            }
        } catch (error) {
            console.error("Fejl ved hentning af historik:", error);
        } finally {
            setIsLoadingHistory(false);
        }
    };

    // handles fetching more history items when the user scrolls to the bottom
    const fetchMoreHistory = useCallback(() => {
        if (!isLoadingHistory && hasMore) {
            const nextPage = currentPage + 1;
            setCurrentPage(nextPage);
            loadHistory(nextPage);
        }
    }, [isLoadingHistory, hasMore, currentPage]);

    // Renders the main content based on the active view
    function renderContent() {
        if (activeView === "buttons") {
            const items = [
                {
                    key: "allergies",
                    icon: "warning-outline",
                    color: "#16a34a",
                    value: String(allergyCount),
                    label: t("Allergies"),
                    onPress: () => setActiveView("allergies"),
                    loading: isLoadingAllergies
                },
                {
                    key: "history",
                    icon: "time-outline",
                    color: "#6366f1",
                    value: String(historyCount),
                    label: t("History"),
                    onPress: () => {
                        if (historyItems.length === 0) loadHistory(1);
                        setActiveView("history");
                    },
                    loading: isLoadingCount
                },
            ];

            return (
                <View className="w-full flex-row flex-wrap justify-between mt-2">
                    {items.map((item) => (
                        <View key={item.key} className="w-[48%] mb-5">
                            <TouchableOpacity
                                activeOpacity={0.85}
                                onPress={item.onPress}
                                className="w-full h-[125px] rounded-2xl items-center justify-center"
                                style={{ backgroundColor: theme.surface, borderWidth: 1, borderColor: theme.borderSoft }}
                            >
                                <Ionicons name={item.icon as any} size={40} color={item.color} />
                                {item.loading ? (
                                    <ActivityIndicator size="small" color={theme.text} className="mt-2" />
                                ) : (
                                    <Text className="text-lg font-bold mt-2" style={{ color: theme.text }}>{item.value}</Text>
                                )}
                                <Text className="text-sm mt-1" style={{ color: theme.textMuted }}>{item.label}</Text>
                            </TouchableOpacity>
                        </View>
                    ))}
                </View>
            );
        }

        if (activeView === "allergies") {
            return (
                <UserAllergyList 
                    userAllergens={userAllergens} 
                    onUpdateAllergens={handleUpdateAllergens} 
                    loading={isLoadingAllergies} 
                />
            );
        }

        return (
            <UserScanHistory
                historyItems={historyItems}
                loading={isLoadingHistory}
                errorText={null}
                onLoadMore={fetchMoreHistory}
            />
        );
    }

    return (
        <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 28 }} showsVerticalScrollIndicator={false}>
            <DefaultCard className="items-center px-5 py-5">
                <View className="mb-4 w-full">
                    {activeView !== "buttons" && (
                        <TouchableOpacity onPress={() => setActiveView("buttons")} className="mb-4 flex-row items-center self-start">
                            <Ionicons name="arrow-back" size={18} color={theme.text} />
                            <Text className="ml-2 text-sm font-medium" style={{ color: theme.text }}>{t("Back")}</Text>
                        </TouchableOpacity>
                    )}
                    <Text className="text-center text-xl font-bold" style={{ color: theme.text }}>
                        {authLoading ? "..." : user?.email?.split("@")[0] || "User"}
                    </Text>
                </View>

                <View className="mb-4 w-full max-w-[260px] flex-row items-center justify-between">
                    <View className="items-center">
                        <Text className="text-lg font-bold" style={{ color: theme.text }}>{allergyCount}</Text>
                        <Text className="mt-1 text-xs" style={{ color: theme.textMuted }}>{t("Allergies")}</Text>
                    </View>
                    <View className="h-9 w-[1px]" style={{ backgroundColor: theme.borderSoft }} />
                    <View className="items-center">
                        <Text className="text-lg font-bold" style={{ color: theme.text }}>{historyCount}</Text>
                        <Text className="mt-1 text-xs" style={{ color: theme.textMuted }}>{t("History")}</Text>
                    </View>
                </View>

                <View className="mb-4 h-[1px] w-full" style={{ backgroundColor: theme.borderSoft }} />
                <View className="w-full">{renderContent()}</View>
            </DefaultCard>
        </ScrollView>
    );
}