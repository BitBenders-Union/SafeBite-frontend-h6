// /components/Shared/TosModal.tsx

import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from "react-native";

import { PrimaryButton } from "@/components/Shared/PrimaryButton";

type Props = {
    visible: boolean;
    onClose: () => void;
    buttonLabel?: string;
    onAccept?: () => void;
};

export function TosModal({
    visible,
    onClose,
    buttonLabel,
    onAccept,
}: Props) {
    const { theme } = useAppTheme();
    const { t } = useTranslation("disclaimer");

    const hasAccept = !!onAccept;

    const resolvedTitle = t("title");
    const resolvedButtonLabel =
        buttonLabel || (hasAccept ? t("modalAccept") : t("modalClose"));

    function handlePress() {
        if (onAccept) {
            onAccept();
            return;
        }

        onClose();
    }

    return (
        <Modal
            transparent
            animationType="fade"
            visible={visible}
            statusBarTranslucent
            presentationStyle="overFullScreen"
            onRequestClose={onClose}
        >
            <View
                style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 20,
                }}
            >
                <Pressable
                    onPress={onClose}
                    style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        left: 0,
                    }}
                >
                    {Platform.OS === "ios" ? (
                        <BlurView intensity={130} tint="dark" style={{ flex: 1 }} />
                    ) : (
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: "rgba(0,0,0,0.7)",
                            }}
                        />
                    )}
                </Pressable>

                <View
                    style={{
                        width: "88%",
                        maxWidth: 520,
                        backgroundColor: theme.card,
                        borderRadius: 22,
                        borderWidth: 1,
                        borderColor: theme.border,
                        paddingVertical: 24,
                        paddingHorizontal: 22,
                        position: "relative",
                        shadowColor: theme.shadowCard.color,
                        shadowOpacity: theme.shadowCard.opacity,
                        shadowOffset: theme.shadowCard.offset,
                        shadowRadius: theme.shadowCard.radius,
                    }}
                >
                    <View
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 2,
                        }}
                    >
                        <Pressable
                            onPress={onClose}
                            hitSlop={10}
                            style={({ pressed }) => ({
                                backgroundColor: theme.surface,
                                borderRadius: 999,
                                borderWidth: 1,
                                borderColor: theme.border,
                                padding: 6,
                                opacity: pressed ? 0.7 : 1,
                            })}
                        >
                            <Ionicons name="close" size={18} color={theme.text} />
                        </Pressable>
                    </View>

                    <View
                        style={{
                            marginBottom: 12,
                            borderRadius: 999,
                            padding: 12,
                            alignSelf: "center",
                            backgroundColor: theme.surface,
                            borderWidth: 1,
                            borderColor: theme.border,
                        }}
                    >
                        <Ionicons
                            name="document-text-outline"
                            size={28}
                            color={theme.text}
                        />
                    </View>

                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 18,
                            fontWeight: "700",
                            marginBottom: 10,
                            textAlign: "center",
                        }}
                    >
                        {resolvedTitle}
                    </Text>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={{
                            maxHeight: 340,
                            marginBottom: 18,
                        }}
                    >
                        <Text
                            style={{
                                color: theme.textMuted,
                                fontSize: 14,
                                lineHeight: 22,
                                textAlign: "left",
                            }}
                        >
                            {t("tosText")}
                        </Text>
                    </ScrollView>

                    <View style={{ flexDirection: "row", gap: 10 }}>
                        {/* Close */}
                        <View style={{ flex: 1 }}>
                            <PrimaryButton
                                label={t("modalClose")}
                                onPress={onClose}
                                className="opacity-90"

                            />
                        </View>

                        {/* Accept button  */}
                        {onAccept && (
                            <View style={{ flex: 1 }}>
                                <PrimaryButton
                                    label={t("modalAccept")}
                                    onPress={onAccept}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </View>
        </Modal>
    );
}