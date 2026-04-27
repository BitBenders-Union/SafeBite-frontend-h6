// /components/scan/alert.tsx
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import React from "react";
import { useTranslation } from "react-i18next";
import {
    Modal,
    Platform,
    Pressable,
    Text,
    View,
} from "react-native";

interface AllergyAlertProps {
    allergens: string[];
    onClose: () => void;
}

// Scan result alert component.
export default function AllergyAlert({ allergens, onClose }: AllergyAlertProps) {
    const { t } = useTranslation("scan");
    const { theme } = useAppTheme();

    return (
        <Modal
            transparent
            animationType="fade"
            visible
            statusBarTranslucent
            presentationStyle="overFullScreen"
        >
            <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                {/* Backdrop */}
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

                {/* Popup */}
                <View
                    style={{
                        width: "78%",
                        maxWidth: 360,
                        backgroundColor: theme.card,
                        borderRadius: 22,
                        borderWidth: 2,
                        borderColor: theme.dangerBorder,
                        paddingVertical: 26,
                        paddingHorizontal: 28,
                        alignItems: "center",
                        position: "relative",
                        shadowColor: theme.shadowCard.color,
                        shadowOpacity: theme.shadowCard.opacity,
                        shadowOffset: theme.shadowCard.offset,
                        shadowRadius: theme.shadowCard.radius,
                    }}
                >
                    {/* Close button */}
                    <View
                        style={{
                            position: "absolute",
                            top: 10,
                            right: 10,
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
                            marginBottom: 10,
                            borderRadius: 999,
                            padding: 12,
                            backgroundColor: theme.dangerBg,
                            borderWidth: 1,
                            borderColor: theme.dangerBorder,
                        }}
                    >
                        <Ionicons
                            name="warning"
                            size={34}
                            color={theme.dangerSolid}
                        />
                    </View>

                    <Text
                        style={{
                            color: theme.dangerText,
                            fontSize: 18,
                            fontWeight: "700",
                            marginBottom: 6,
                            textAlign: "center",
                        }}
                    >
                        {t("allergensDetectedTitle")}
                    </Text>

                    <Text
                        style={{
                            color: theme.textMuted,
                            fontSize: 14,
                            textAlign: "center",
                            marginBottom: 12,
                            lineHeight: 20,
                        }}
                    >
                        {t("allergyDetectedPopupMessage")}
                    </Text>

                    <Text
                        style={{
                            color: theme.text,
                            fontSize: 16,
                            fontWeight: "600",
                            textAlign: "center",
                            lineHeight: 24,
                        }}
                    >
                        {allergens.join(", ")}
                    </Text>
                </View>
            </View>
        </Modal>
    );
}