// 
import { AllergyRow } from "@/components/app/mobil/allergy/AllergyRow";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import {
    Allergy
} from "@/lib/types/allergy";
import {
    addUserAllergy,
    getAllergies,
    getMyAllergyRelations,
    removeUserAllergy,
} from "@/services/api/allergyApi";
import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    FlatList,
    LayoutAnimation,
    Text,
    TextInput,
    View,
} from "react-native";

export default function AllergyListView() {
    const { t } = useTranslation("allergy");
    const { theme } = useAppTheme();

    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");
    const [searchText, setSearchText] = useState("");
    const [allergyList, setAllergyList] = useState<Allergy[]>([]);
    const [addedAllergyIds, setAddedAllergyIds] = useState<Set<string>>(new Set());
    const [loadingIds, setLoadingIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        // Create an instance of AbortController to manage network requests
        const controller = new AbortController();

        async function loadAllergies() {
            try {
                setLoadError("");
                setIsLoading(true);

                // Fetch data and pass the abort signal to the API calls
                const systemAllergies = await getAllergies(controller.signal);
                const userAllergies = await getMyAllergyRelations(controller.signal);

                const userAllergyIds = new Set(
                    userAllergies.map((item) => item.allergyId)
                );

                // Update state only if the component is still mounted
                setAllergyList(systemAllergies);
                setAddedAllergyIds(userAllergyIds);

            } catch (error: any) {
                // Only handle errors that are NOT caused by the user leaving the page
                if (error.name !== "AbortError" && error.name !== "CanceledError") {
                    console.error("Failed to load allergies:", error);
                    setLoadError("Could not load allergy data.");
                }
            } finally {
                // Stop loading indicator regardless of success or failure
                setIsLoading(false);
            }
        }

        loadAllergies();

        // Cleanup function: Aborts the fetch requests if the component unmounts
        return () => {
            controller.abort();
        };
    }, []);

    // Filter allergy list based on search text
    const filteredAllergies = useMemo(() => {
        const searchTerms = searchText
            .toLowerCase()
            .split(',')
            .map(term => term.trim())
            .filter(term => term !== "");

        if (searchTerms.length === 0) {
            return allergyList;
        }

        return allergyList.filter((item) => {
            const itemName = item.name.toLowerCase();

            return searchTerms.some((term) => itemName.includes(term));
        });
    }, [allergyList, searchText]);

    async function toggleAllergy(item: Allergy) {
        const allergyId = item.id;
        const alreadySelected = addedAllergyIds.has(allergyId);

        LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

        try {
            setLoadingIds((prev) => {
                const next = new Set(prev);
                next.add(allergyId);
                return next;
            });

            if (alreadySelected) {
                await removeUserAllergy(allergyId);

                setAddedAllergyIds((prev) => {
                    const next = new Set(prev);
                    next.delete(allergyId);
                    return next;
                });
            } else {
                await addUserAllergy(allergyId);

                setAddedAllergyIds((prev) => {
                    const next = new Set(prev);
                    next.add(allergyId);
                    return next;
                });
            }
        } catch (error) {
            console.error("Toggle allergy failed:", error);
        } finally {
            setLoadingIds((prev) => {
                const next = new Set(prev);
                next.delete(allergyId);
                return next;
            });
        }
    }

    if (isLoading) {
        return (
            <ActivityIndicator
                testID="loading-indicator"
                size="small"
                color={theme.successText}
            />
        );
    }

    if (loadError) {
        return (
            <Text
                className="py-4 text-center text-sm"
                style={{ color: theme.dangerText }}
            >
                {loadError}
            </Text>
        );
    }

    return (
        <>
            <View
                className="mb-4 flex-row items-center rounded-xl border px-4 py-2 shadow-sm"
                style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                }}
            >
                <Ionicons
                    name="search"
                    size={18}
                    color={theme.textMuted}
                />

                <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder={t("searchAllergens")}
                    placeholderTextColor={theme.textMuted}
                    className="ml-2 flex-1 text-sm"
                    style={{ color: theme.text }}
                />
            </View>

            <FlatList
                data={filteredAllergies}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                    const added = addedAllergyIds.has(item.id);
                    const isToggling = loadingIds.has(item.id);

                    return (
                        <AllergyRow
                            allergy={item}
                            isAdded={added}
                            onToggle={toggleAllergy}
                            isLoading={isToggling}
                            translate={t}
                        />
                    );
                }}
                scrollEnabled={false}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingBottom: 16 }}
                ListEmptyComponent={
                    <Text
                        className="py-4 text-center text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        {t("noAllergensFound")}
                    </Text>
                }
            />
        </>
    );
}