// /components/app/admin/allergies/AdminAllergyRow.tsx

import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Allergy } from "@/lib/types/allergy";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    item: Allergy;
    onEdit: (item: Allergy) => void;
    onDelete: (item: Allergy) => void;
};

function getSafeIconName(icon?: string | null) {
    if (!icon) return "help-circle-outline";
    if (icon === "lobster") return "space-invaders";
    return icon;
}

export default function AdminAllergyRow({
    item,
    onEdit,
    onDelete,
}: Props) {
    const { t } = useTranslation("adminallergy");
    const { theme } = useAppTheme();

    return (
        <View
            className="mb-3 flex-row items-center justify-between rounded-xl border px-4 py-3 shadow-sm"
            style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
            }}
        >
            <View className="flex-row items-center">
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

                <View>
                    <Text
                        className="text-[15px] font-medium"
                        style={{ color: theme.text }}
                    >
                        {item.name}
                    </Text>

                    <Text
                        className="mt-1 text-xs"
                        style={{ color: theme.textMuted }}
                    >
                        Id: {item.id}
                    </Text>
                </View>
            </View>

            <View className="flex-row items-center gap-2">
                <TouchableOpacity
                    onPress={() => onEdit(item)}
                    activeOpacity={0.85}
                    style={{
                        minWidth: 82,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderRadius: 999,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.activeSoft,
                    }}
                >
                    <Ionicons
                        name="create-outline"
                        size={14}
                        color={theme.active}
                    />
                    <Text
                        className="ml-1 text-[12px] font-semibold"
                        style={{ color: theme.active }}
                    >
                        {t("allergyRow.editBtn")}
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => onDelete(item)}
                    activeOpacity={0.85}
                    style={{
                        minWidth: 82,
                        paddingVertical: 8,
                        paddingHorizontal: 14,
                        borderRadius: 999,
                        flexDirection: "row",
                        alignItems: "center",
                        justifyContent: "center",
                        backgroundColor: theme.dangerBg,
                        borderWidth: 1,
                        borderColor: theme.dangerBorder,
                    }}
                >
                    <Ionicons
                        name="trash-outline"
                        size={14}
                        color={theme.dangerText}
                    />
                    <Text
                        className="ml-1 text-[12px] font-semibold"
                        style={{ color: theme.dangerText }}
                    >
                        {t("allergyRow.deleteBtn")}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}