// /components/app/mobil/userProfile/UserAllergyList.tsx

import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Keyboard,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

import { useAppTheme } from "@/lib/theme/useAppTheme";

export type Allergen = {
    id: number;
    name: string;
    icon?: string;
};

type UserAllergyListProps = {
    userAllergens: Allergen[];
    onUpdateAllergens: (updated: Allergen[]) => void;
    loading?: boolean;
};

function getSafeIconName(icon?: string) {
    if (!icon) return "food-apple-outline";
    if (icon === "lobster") return "space-invaders";
    return icon.replace("-outline", "");
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

    const filteredAllergens = useMemo(() => {
        return userAllergens.filter((item) =>
            item.name.toLowerCase().includes(search.toLowerCase())
        );
    }, [userAllergens, search]);

    function handleRemove(id: number) {
        const updatedItems = userAllergens.filter((item) => item.id !== id);
        onUpdateAllergens(updatedItems);
    }

    function handleAddCustom() {
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

        const nextId =
            userAllergens.length > 0
                ? Math.max(...userAllergens.map((item) => item.id)) + 1
                : 1;

        const updatedItems = [
            ...userAllergens,
            {
                id: nextId,
                name: trimmedName,
                icon: "alert-circle-outline",
            },
        ];

        onUpdateAllergens(updatedItems);
        setCustomAllergen("");
        Keyboard.dismiss();
    }

    return (
        <View className="w-full">
            <Text
                className="mb-1 text-lg font-semibold"
                style={{ color: theme.text }}
            >
                {t("profileTitle")}
            </Text>

            <Text
                className="mb-4 text-xs"
                style={{ color: theme.textMuted }}
            >
                {t("profileSubtitle")}
            </Text>

            <View className="w-full">
                <View className="rounded-2xl py-5">
                    <Text
                        className="mb-1 text-sm font-semibold"
                        style={{ color: theme.text }}
                    >
                        {t("addCustomAllergen")}
                    </Text>

                    <Text
                        className="mb-3 text-xs"
                        style={{ color: theme.textMuted }}
                    >
                        {t("didNotFindAllergen")}
                    </Text>

                    <View
                        className="flex-row items-center rounded-xl border px-4 shadow-sm"
                        style={{
                            backgroundColor: theme.inputBg,
                            borderColor: theme.inputBorder,
                        }}
                    >
                        <TextInput
                            value={customAllergen}
                            onChangeText={setCustomAllergen}
                            placeholder={t("typeAllergenName")}
                            placeholderTextColor={theme.textPlaceholder}
                            className="flex-1 py-3 text-sm"
                            style={{ color: theme.text }}
                            onSubmitEditing={handleAddCustom}
                            returnKeyType="done"
                        />

                        <TouchableOpacity
                            onPress={handleAddCustom}
                            activeOpacity={0.8}
                            testID="addCustomButton"
                        >
                            <Ionicons
                                name="add-circle"
                                size={24}
                                color={theme.successText}
                            />
                        </TouchableOpacity>
                    </View>
                </View>

                <View
                    className="mb-4 flex-row items-center rounded-xl border px-4 py-2 shadow-sm"
                    style={{
                        backgroundColor: theme.inputBg,
                        borderColor: theme.inputBorder,
                    }}
                >
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

                <View className="max-h-56">
                    {loading ? (
                        <View className="items-center justify-center py-6">
                            <ActivityIndicator
                                size="small"
                                color={theme.buttonPrimaryBg}
                            />
                        </View>
                    ) : filteredAllergens.length === 0 ? (
                        <View className="px-2 py-4">
                            <Text
                                className="text-center text-sm"
                                style={{ color: theme.textMuted }}
                            >
                                {t("noAllergensFound")}
                            </Text>
                        </View>
                    ) : (
                        filteredAllergens.map((item) => (
                            <View
                                key={item.id}
                                className="mb-3 flex-row items-center justify-between rounded-xl border px-4 py-3 shadow-sm"
                                style={{
                                    backgroundColor: theme.inputBg,
                                    borderColor: theme.inputBorder,
                                }}
                            >
                                <View className="flex-1 flex-row items-center">
                                    <View
                                        className="mr-3 h-10 w-10 items-center justify-center rounded-full border"
                                        style={{ borderColor: theme.border }}
                                    >
                                        <MaterialCommunityIcons
                                            name={getSafeIconName(item.icon) as any}
                                            size={22}
                                            color={theme.iconPrimary}
                                        />
                                    </View>

                                    <Text
                                        className="flex-1 text-[15px] font-medium"
                                        style={{ color: theme.text }}
                                    >
                                        {item.name}
                                    </Text>
                                </View>

                                <TouchableOpacity
                                    onPress={() => handleRemove(item.id)}
                                    activeOpacity={0.85}
                                    className="flex-row items-center justify-center rounded-full px-3 py-1.5"
                                    style={{
                                        backgroundColor: theme.dangerSolid,
                                    }}
                                >
                                    <Ionicons
                                        name="remove"
                                        size={14}
                                        color={theme.dangerSolidText}
                                    />
                                    <Text
                                        className="ml-1 text-[12px] font-semibold"
                                        style={{
                                            color: theme.dangerSolidText,
                                        }}
                                    >
                                        {t("remove")}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        ))
                    )}
                </View>
            </View>
        </View>
    );
}