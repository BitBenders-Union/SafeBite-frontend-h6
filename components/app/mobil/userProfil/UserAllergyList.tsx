// /components/app/mobil/userProfil/UserAllergyList.tsx
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, Keyboard, Text, TextInput, TouchableOpacity, View, ScrollView } from "react-native";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { addCustomAllergy, deleteCustomAllergy, deleteUserAllergy } from "@/services/api/allergyApi";

export type Allergen = {
    id: string;
    name: string;
    icon?: string;
    isCustom?: boolean; 
};

type UserAllergyListProps = {
    userAllergens: Allergen[];
    onUpdateAllergens: (updated: Allergen[]) => void;
    loading?: boolean;
};

// Ensures that the icon name is valid and falls back to a default if not
function getSafeIconName(icon?: string) {
    if (!icon) return "food-apple-outline";
    return icon as any; 
}

export default function UserAllergyList({
    userAllergens,
    onUpdateAllergens,
    loading = false,
}: UserAllergyListProps) {
    const { t } = useTranslation("allergy");
    const { theme } = useAppTheme();
    const [search, setSearch] = useState("");
    const [customAllergen, setCustomAllergen] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);

    const filteredAllergens = useMemo(() => {
        return userAllergens.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [userAllergens, search]);

    // Handles removing an allergen
    async function handleRemove(allergy: Allergen) {
        try {
            setIsActionLoading(true);
            
            if (allergy.isCustom) {
                await deleteCustomAllergy(allergy.id); 
            } else {
                await deleteUserAllergy(allergy.id);
            }
            
            const updatedItems = userAllergens.filter((item) => item.id !== allergy.id);
            onUpdateAllergens(updatedItems);
        } catch (error) {
            console.error("Kunne ikke fjerne allergi:", error);
        } finally {
            setIsActionLoading(false);
        }
    }

    // Handles adding a new custom allergen
    async function handleAddCustom() {
        const trimmedName = customAllergen.trim();
        if (!trimmedName) return;

        const alreadyExists = userAllergens.some(
            (item) => item.name.toLowerCase() === trimmedName.toLowerCase()
        );

        if (alreadyExists) {
            setCustomAllergen("");
            Keyboard.dismiss();
            return;
        }

        try {
            setIsActionLoading(true);
            const newAllergy = await addCustomAllergy(trimmedName);
            
            const updatedItems: Allergen[] = [
                ...userAllergens,
                {
                    id: newAllergy.id,
                    name: newAllergy.name,
                    icon: "pencil-outline",
                    isCustom: true
                },
            ];

            onUpdateAllergens(updatedItems);
            setCustomAllergen("");
            Keyboard.dismiss();
        } catch (error) {
            console.error("Kunne ikke oprette custom allergi:", error);
        } finally {
            setIsActionLoading(false);
        }
    }

    return (
        <View className="w-full">
            <Text className="mb-1 text-lg font-semibold" style={{ color: theme.text }}>{t("profileTitle")}</Text>
            <Text className="mb-4 text-xs" style={{ color: theme.textMuted }}>{t("profileSubtitle")}</Text>

            <View className="w-full">
                <View className="rounded-2xl py-5">
                    <Text className="mb-1 text-sm font-semibold" style={{ color: theme.text }}>{t("addCustomAllergen")}</Text>
                    <View className="flex-row items-center rounded-xl border px-4 shadow-sm" style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }}>
                        <TextInput
                            value={customAllergen}
                            onChangeText={setCustomAllergen}
                            placeholder={t("typeAllergenName")}
                            placeholderTextColor={theme.textPlaceholder}
                            className="flex-1 py-3 text-sm"
                            style={{ color: theme.text }}
                            editable={!isActionLoading}
                        />
                        <TouchableOpacity onPress={handleAddCustom} disabled={isActionLoading}>
                            {isActionLoading ? (
                                <ActivityIndicator size="small" color={theme.successText} />
                            ) : (
                                <Ionicons name="add-circle" size={24} color={theme.successText} />
                            )}
                        </TouchableOpacity>
                    </View>
                </View>

                <View className="mb-4 flex-row items-center rounded-xl border px-4 py-2 shadow-sm" style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }}>
                    <Ionicons name="search" size={18} color={theme.textMuted} />
                    <TextInput
                        value={search}
                        onChangeText={setSearch}
                        placeholder={t("searchAllergens")}
                        placeholderTextColor={theme.textPlaceholder}
                        className="ml-2 flex-1 text-sm"
                        style={{ color: theme.text }}
                    />
                </View>

                {/* Intern ScrollView med fast højde så den ikke stikker ud */}
                <View className="max-h-64">
                    {loading ? (
                        <View className="items-center justify-center py-6">
                            <ActivityIndicator size="small" color={theme.buttonPrimaryBg} />
                        </View>
                    ) : (
                        <ScrollView 
                            nestedScrollEnabled={true} 
                            showsVerticalScrollIndicator={true}
                            className="pr-1"
                        >
                            {filteredAllergens.map((item) => (
                                <View key={item.id} className="mb-3 flex-row items-center justify-between rounded-xl border px-4 py-3 shadow-sm" style={{ backgroundColor: theme.inputBg, borderColor: theme.inputBorder }}>
                                    <View className="flex-1 flex-row items-center">
                                        <View className="mr-3 h-10 w-10 items-center justify-center rounded-full border" style={{ borderColor: theme.border }}>
                                            <MaterialCommunityIcons name={getSafeIconName(item.icon) as any} size={22} color={theme.iconPrimary} />
                                        </View>
                                        <Text className="flex-1 text-[15px] font-medium" style={{ color: theme.text }}>{item.name}</Text>
                                    </View>
                                    <TouchableOpacity 
                                        onPress={() => handleRemove(item)} 
                                        disabled={isActionLoading}
                                        className="flex-row items-center justify-center rounded-full px-3 py-1.5" 
                                        style={{ backgroundColor: theme.dangerSolid }}
                                    >
                                        <Ionicons name="remove" size={14} color={theme.dangerSolidText} />
                                        <Text className="ml-1 text-[12px] font-semibold" style={{ color: theme.dangerSolidText }}>{t("remove")}</Text>
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    )}
                </View>
            </View>
        </View>
    );
}