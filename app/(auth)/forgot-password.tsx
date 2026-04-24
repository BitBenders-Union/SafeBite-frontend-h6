// /app/(auth)/forgot-password.tsx

import { AuthCard } from "@/components/Shared/AuthCard";
import { PrimaryButton } from "@/components/Shared/PrimaryButton";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { forgotPassword } from "@/services/apiServices/authApi";
import { router } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ForgotPassword() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("auth");

    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [requestError, setRequestError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const isDisabled = isLoading;

    async function handleForgotPassword() {
        if (isDisabled) return;

        setEmailError("");
        setRequestError("");
        setSuccessMessage("");

        if (!email) {
            setEmailError(t("inputEmailError"));
            return;
        }

        try {
            setIsLoading(true);

            await forgotPassword(email);

            setSuccessMessage(t("forgotPasswordSuccess"));
        } catch {
            setRequestError(t("forgotPasswordFailed"));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView
                className="flex-1"
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        paddingHorizontal: 20,
                        paddingTop: 40,
                        paddingBottom: 40,
                    }}
                    keyboardShouldPersistTaps="handled"
                    bounces={false}
                >
                    <View className="flex-1 items-center justify-center">
                        <View className="w-full max-w-sm">
                            <AuthCard>
                                <View className="mb-6 items-center">
                                    <Text
                                        className="text-xl font-semibold"
                                        style={{ color: theme.text }}
                                    >
                                        {t("forgotPasswordTitle")}
                                    </Text>

                                    <Text
                                        className="mt-1 text-center text-sm"
                                        style={{ color: theme.textMuted }}
                                    >
                                        {t("forgotPasswordSubtitle")}
                                    </Text>
                                </View>

                                <View className="mb-4">
                                    <TextInput
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (emailError) setEmailError("");
                                            if (requestError) setRequestError("");
                                        }}
                                        editable={!isDisabled && !successMessage}
                                        placeholder={t("emailPlaceholder")}
                                        placeholderTextColor={theme.textPlaceholder}
                                        keyboardType="email-address"
                                        autoCapitalize="none"
                                        autoCorrect={false}
                                        autoComplete="email"
                                        className="rounded-xl border px-3 py-3 text-base"
                                        style={{
                                            backgroundColor: theme.inputBg,
                                            borderColor: emailError
                                                ? theme.dangerBorder
                                                : theme.inputBorder,
                                            color: theme.text,
                                        }}
                                    />

                                    <View className="mt-1 min-h-[18px]">
                                        {emailError ? (
                                            <Text
                                                className="text-xs"
                                                style={{ color: theme.dangerText }}
                                            >
                                                {emailError}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>

                                {!successMessage ? (
                                    <PrimaryButton
                                        label={t("forgotPasswordButton")}
                                        onPress={handleForgotPassword}
                                        loading={isLoading}
                                        disabled={isDisabled}
                                    />
                                ) : (
                                    <PrimaryButton
                                        label={t("continueButton")}
                                        onPress={() =>
                                            router.push({
                                                pathname: "/reset-password",
                                                params: { email },
                                            })
                                        }
                                    />
                                )}

                                <View className="mt-2 min-h-[40px] items-center justify-center">
                                    {requestError ? (
                                        <Text
                                            className="text-center text-sm"
                                            style={{ color: theme.dangerText }}
                                        >
                                            {requestError}
                                        </Text>
                                    ) : null}

                                    {successMessage ? (
                                        <Text
                                            className="text-center text-sm"
                                            style={{ color: theme.successText }}
                                        >
                                            {successMessage}
                                        </Text>
                                    ) : null}
                                </View>

                                <TouchableOpacity
                                    onPress={() => router.replace("/auth")}
                                    activeOpacity={0.7}
                                    className="mt-2 items-center"
                                >
                                    <Text
                                        className="text-sm font-semibold"
                                        style={{ color: theme.linkText }}
                                    >
                                        {t("backToLogin")}
                                    </Text>
                                </TouchableOpacity>
                            </AuthCard>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}