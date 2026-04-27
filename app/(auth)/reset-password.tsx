// /app/(auth)/reset-password.tsx

import { AuthCard } from "@/components/Shared/AuthCard";
import { PrimaryButton } from "@/components/Shared/PrimaryButton";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { resetPassword } from "@/services/api/authApi";
import { router, useLocalSearchParams } from "expo-router";
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

export default function ResetPassword() {
    const { theme } = useAppTheme();
    const { t } = useTranslation("auth");

    const params = useLocalSearchParams<{ email?: string }>();

    const [email, setEmail] = useState(params.email ?? "");
    const [resetCode, setResetCode] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [resetCodeError, setResetCodeError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const [requestError, setRequestError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const isDisabled = isLoading;

    async function handleResetPassword() {
        if (isDisabled) return;

        setEmailError("");
        setResetCodeError("");
        setPasswordError("");
        setRequestError("");
        setSuccessMessage("");

        if (!email) {
            setEmailError(t("inputEmailError"));
            return;
        }

        if (!resetCode) {
            setResetCodeError(t("resetCodePlaceholder"));
            return;
        }

        if (!newPassword) {
            setPasswordError(t("inputPasswordError"));
            return;
        }

        try {
            setIsLoading(true);

            await resetPassword({
                email,
                resetCode,
                newPassword,
            });

            setSuccessMessage(t("resetPasswordSuccess"));
        } catch {
            setRequestError(t("resetPasswordFailed"));
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
                                        {t("resetPasswordTitle")}
                                    </Text>

                                    <Text
                                        className="mt-1 text-center text-sm"
                                        style={{ color: theme.textMuted }}
                                    >
                                        {t("resetPasswordSubtitle")}
                                    </Text>
                                </View>

                                {/* Email */}
                                <View className="mb-4">
                                    <TextInput
                                        value={email}
                                        onChangeText={(text) => {
                                            setEmail(text);
                                            if (emailError) setEmailError("");
                                        }}
                                        editable={!isDisabled && !successMessage}
                                        placeholder={t("emailPlaceholder")}
                                        placeholderTextColor={theme.textPlaceholder}
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

                                {/* Reset Code */}
                                <View className="mb-4">
                                    <TextInput
                                        value={resetCode}
                                        onChangeText={(text) => {
                                            setResetCode(text);
                                            if (resetCodeError) setResetCodeError("");
                                        }}
                                        editable={!isDisabled && !successMessage}
                                        placeholder={t("resetCodePlaceholder")}
                                        placeholderTextColor={theme.textPlaceholder}
                                        className="rounded-xl border px-3 py-3 text-base"
                                        style={{
                                            backgroundColor: theme.inputBg,
                                            borderColor: resetCodeError
                                                ? theme.dangerBorder
                                                : theme.inputBorder,
                                            color: theme.text,
                                        }}
                                    />

                                    <View className="mt-1 min-h-[18px]">
                                        {resetCodeError ? (
                                            <Text
                                                className="text-xs"
                                                style={{ color: theme.dangerText }}
                                            >
                                                {resetCodeError}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>

                                {/* New Password */}
                                <View className="mb-4">
                                    <TextInput
                                        value={newPassword}
                                        onChangeText={(text) => {
                                            setNewPassword(text);
                                            if (passwordError) setPasswordError("");
                                        }}
                                        editable={!isDisabled && !successMessage}
                                        placeholder={t("newPasswordPlaceholder")}
                                        placeholderTextColor={theme.textPlaceholder}
                                        secureTextEntry
                                        className="rounded-xl border px-3 py-3 text-base"
                                        style={{
                                            backgroundColor: theme.inputBg,
                                            borderColor: passwordError
                                                ? theme.dangerBorder
                                                : theme.inputBorder,
                                            color: theme.text,
                                        }}
                                    />

                                    <View className="mt-1 min-h-[18px]">
                                        {passwordError ? (
                                            <Text
                                                className="text-xs"
                                                style={{ color: theme.dangerText }}
                                            >
                                                {passwordError}
                                            </Text>
                                        ) : null}
                                    </View>
                                </View>

                                {!successMessage ? (
                                    <PrimaryButton
                                        label={t("resetPasswordButton")}
                                        onPress={handleResetPassword}
                                        loading={isLoading}
                                        disabled={isDisabled}
                                    />
                                ) : (
                                    <PrimaryButton
                                        label={t("backToLogin")}
                                        onPress={() => router.replace("/auth")}
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