// /components/app/admin/iconPicker/AllergyIconPicker.tsx

import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";
import { allergyIconOptions } from "./iconOptions";

type Props = {
    value: string;
    onChange: (iconName: string) => void;
    label?: string;
};

function getSafeIconName(icon?: string | null) {
    if (!icon) return "help-circle-outline";
    if (!(icon in MaterialCommunityIcons.glyphMap)) {
        return "help-circle-outline";
    }

    return icon as keyof typeof MaterialCommunityIcons.glyphMap;
}

export default function AllergyIconPicker({
    value,
    onChange,
    label,
}: Props) {
    const { t } = useTranslation("adminallergy");
    const { theme } = useAppTheme();
    const [open, setOpen] = useState(false);

    const selectedOption = allergyIconOptions.find(
        (option) => option.value === value
    );

    return (
        <View>
            <Text
                className="mb-2 text-sm font-medium"
                style={{ color: theme.text }}
            >
                {label ?? t("IconPickerlabel")}
            </Text>

            <TouchableOpacity
                onPress={() => setOpen((current) => !current)}
                activeOpacity={0.8}
                className="rounded-xl border px-4 py-3"
                style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                }}
            >
                <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons
                            name={getSafeIconName(value)}
                            size={22}
                            color={theme.iconPrimary}
                        />

                        <Text
                            className="ml-3"
                            style={{ color: theme.text }}
                        >
                            {selectedOption?.label ?? t("IconPickerplaceholder")}
                        </Text>
                    </View>

                    <Ionicons
                        name={open ? "chevron-up" : "chevron-down"}
                        size={18}
                        color={theme.textMuted}
                    />
                </View>
            </TouchableOpacity>

            {open && (
                <View
                    className="mt-2 rounded-xl border p-2"
                    style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    }}
                >
                    {allergyIconOptions.map((option) => {
                        const active = value === option.value;

                        return (
                            <TouchableOpacity
                                key={option.value}
                                onPress={() => {
                                    onChange(option.value);
                                    setOpen(false);
                                }}
                                activeOpacity={0.8}
                                className="mb-2 flex-row items-center rounded-lg px-3 py-3"
                                style={{
                                    backgroundColor: active
                                        ? theme.activeSoft
                                        : "transparent",
                                }}
                            >
                                <MaterialCommunityIcons
                                    name={getSafeIconName(option.value)}
                                    size={20}
                                    color={active ? theme.active : theme.iconPrimary}
                                />

                                <Text
                                    className="ml-3 flex-1"
                                    style={{
                                        color: active ? theme.active : theme.text,
                                        fontWeight: active ? "600" : "400",
                                    }}
                                >
                                    {option.label}
                                </Text>
                            </TouchableOpacity>
                        );
                    })}
                </View>
            )}
        </View>
    );
}