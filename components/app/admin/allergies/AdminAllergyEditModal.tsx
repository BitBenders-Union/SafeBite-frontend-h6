// /components/app/admin/allergies/AdminAllergyEditModal.tsx

import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Allergy } from "@/lib/types/allergy";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    ActivityIndicator,
    Modal,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    visible: boolean;
    item: Allergy | null;
    editName: string;
    onChangeName: (value: string) => void;
    onClose: () => void;
    onSave: () => void;
    isSaving: boolean;
    error: string;
};

export default function AdminAllergyEditModal({
    visible,
    item,
    editName,
    onChangeName,
    onClose,
    onSave,
    isSaving,
    error,
}: Props) {
    const { t: t } = useTranslation("adminallergy");
    const { theme } = useAppTheme();

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View
                className="flex-1 items-center justify-center px-4"
                style={{ backgroundColor: "rgba(0,0,0,0.35)" }}
            >
                <View
                    className="w-full max-w-[500px] rounded-2xl border p-5"
                    style={{
                        backgroundColor: theme.card,
                        borderColor: theme.border,
                    }}
                >
                    <Text
                        className="text-xl font-bold"
                        style={{ color: theme.text }}
                    >
                        {t("editModal.title",)}
                    </Text>

                    <Text
                        className="mt-1"
                        style={{ color: theme.textMuted }}
                    >
                        {t("editModal.subtitle")}
                    </Text>

                    {item ? (
                        <View className="mt-4">
                            <Text
                                className="text-sm"
                                style={{ color: theme.textMuted }}
                            >
                                Id: {item.id}
                            </Text>
                        </View>
                    ) : null}

                    <View className="mt-4">
                        <Text
                            className="mb-2 text-sm font-semibold"
                            style={{ color: theme.text }}
                        >
                            {t("editModal.fieldName")}
                        </Text>

                        <TextInput
                            value={editName}
                            onChangeText={onChangeName}
                            placeholder={t("editModal.placeholder")}
                            placeholderTextColor={theme.textPlaceholder}
                            className="rounded-xl border px-4 py-3"
                            style={{
                                color: theme.text,
                                backgroundColor: theme.inputBg,
                                borderColor: theme.inputBorder,
                            }}
                        />
                    </View>

                    {error ? (
                        <Text
                            className="mt-4"
                            style={{ color: theme.dangerText }}
                        >
                            {error}
                        </Text>
                    ) : null}

                    <View className="mt-6 flex-row justify-end gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="rounded-xl px-4 py-3"
                            style={{ backgroundColor: theme.surfaceSoft }}
                        >
                            <Text style={{ color: theme.text }}>
                                {t("actions.cancel")}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onSave}
                            disabled={isSaving}
                            className="rounded-xl px-4 py-3"
                            style={{ backgroundColor: theme.activeSoft }}
                        >
                            {isSaving ? (
                                <ActivityIndicator
                                    size="small"
                                    color={theme.active}
                                />
                            ) : (
                                <Text
                                    style={{
                                        color: theme.active,
                                        fontWeight: "600",
                                    }}
                                >
                                    {t("actions.save")}
                                </Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}