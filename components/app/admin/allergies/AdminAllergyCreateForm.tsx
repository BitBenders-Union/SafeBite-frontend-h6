// /components/app/admin/allergies/AdminAllergyCreateForm.tsx

import AllergyIconPicker from "@/components/app/admin/iconPicker/AllergyIconPicker";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    newName: string;
    onChangeName: (value: string) => void;
    newIcon: string;
    onChangeIcon: (value: string) => void;
    onCreate: () => void;
    isCreating: boolean;
    createError: string;
};

export default function AdminAllergyCreateForm({
    newName,
    onChangeName,
    newIcon,
    onChangeIcon,
    onCreate,
    isCreating,
    createError,
}: Props) {
    const { t } = useTranslation("adminallergy");
    const { theme } = useAppTheme();

    return (
        <View
            className="mb-6 rounded-xl border p-4"
            style={{
                backgroundColor: theme.surfaceSoft,
                borderColor: theme.borderSoft,
            }}
        >
            <Text
                className="mb-3 text-lg font-semibold"
                style={{ color: theme.text }}
            >
                {t("createForm.title")}
            </Text>

            <View className="gap-3">
                <View>
                    <TextInput
                        value={newName}
                        onChangeText={onChangeName}
                        placeholder={t("createForm.placeholder")}
                        placeholderTextColor={theme.textPlaceholder}
                        className="rounded-xl border px-4 py-3"
                        style={{
                            color: theme.text,
                            backgroundColor: theme.inputBg,
                            borderColor: theme.inputBorder,
                        }}
                    />
                </View>

                <View>
                    <AllergyIconPicker
                        value={newIcon}
                        onChange={onChangeIcon}
                    />
                </View>

                <View className="flex-row justify-end">
                    <TouchableOpacity
                        onPress={onCreate}
                        disabled={isCreating}
                        activeOpacity={0.85}
                        style={{
                            minWidth: 110,
                            paddingVertical: 10,
                            paddingHorizontal: 16,
                            borderRadius: 999,
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "center",
                            backgroundColor: theme.activeSoft,
                        }}
                    >
                        {isCreating ? (
                            <ActivityIndicator
                                size="small"
                                color={theme.active}
                            />
                        ) : (
                            <>
                                <Ionicons
                                    name="add"
                                    size={16}
                                    color={theme.active}
                                />
                                <Text
                                    className="ml-1 text-[13px] font-semibold"
                                    style={{ color: theme.active }}
                                >
                                    {t("createForm.submitBtn")}
                                </Text>
                            </>
                        )}
                    </TouchableOpacity>
                </View>

                {createError ? (
                    <Text style={{ color: theme.dangerText }}>
                        {createError}
                    </Text>
                ) : null}
            </View>
        </View>
    );
}