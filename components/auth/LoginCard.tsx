// /components/auth/LoginCard.tsx
import { PrimaryButton } from "@/components/Shared/PrimaryButton";
import { useAuth } from "@/lib/auth/AuthContext";
import { hasLoginErrors, validateLoginForm } from "@/lib/auth/authValidation";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import Checkbox from "expo-checkbox";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Image,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { AuthCard } from "../Shared/AuthCard";


type Props = {
    onToggleAuth: () => void;
    disabledLinks?: boolean;
    signUpResult?: boolean;
    backupSignUpResult?: boolean | null;
};

export function LoginCard({
    onToggleAuth,
    disabledLinks = false,
    signUpResult,
    backupSignUpResult
}: Props) {
    const { theme } = useAppTheme();
    const { t } = useTranslation("auth");
    const { signIn } = useAuth();
    const router = useRouter();

    const [keepSignedIn, setKeepSignedIn] = useState(false);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const isDisabled = isLoading || disabledLinks;

    async function handleLogin() {
        if (isDisabled) return;

        setEmailError("");
        setPasswordError("");
        setLoginError("");

        const errors = validateLoginForm(email, password);

        setEmailError(errors.emailError ? t(errors.emailError) : "");
        setPasswordError(errors.passwordError ? t(errors.passwordError) : "");

        if (hasLoginErrors(errors)) {
            return;
        }

        try {
            setIsLoading(true);



            await signIn({
                email,
                password,
                keepSignedIn
            });

        } catch {
            setLoginError(t("invalidCredentials"));
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard>
            {signUpResult !== undefined && (
                <View
                    className="p-3 rounded-lg mb-4 border"
                    style={{
                        backgroundColor: signUpResult ? theme.successBg : theme.dangerBg,
                        borderColor: signUpResult ? theme.successBorder : theme.dangerBorder,
                    }}
                >
                    <Text
                        className="text-base font-medium text-center"
                        style={{
                            color: signUpResult ? theme.successText : theme.dangerText
                        }}
                    >
                        {signUpResult ? t("loginAfterSignupMessage") : t("signupFailed")}
                    </Text>
                </View>
            )}

            <View className="mb-6 items-center justify-center">
                <Text
                    className="mt-1 text-center text-sm"
                    style={{ color: theme.textMuted }}
                >
                    {t("welcomeSubtitle")}
                </Text>
            </View>

            <View className="mb-4">
                <TextInput
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError("");
                    }}
                    editable={!isDisabled}
                    placeholder={t("emailPlaceholder")}
                    placeholderTextColor={theme.textPlaceholder}
                    className="rounded-xl border px-3 py-3 text-base"
                    style={{
                        backgroundColor: theme.inputBg,
                        borderColor: emailError ? theme.dangerBorder : theme.inputBorder,
                        color: theme.text,
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    importantForAutofill="yes"
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

            <View className="mb-2">
                <TextInput
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) setPasswordError("");
                    }}
                    editable={!isDisabled}
                    placeholder={t("passwordPlaceholder")}
                    placeholderTextColor={theme.textPlaceholder}
                    secureTextEntry
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="current-password"
                    importantForAutofill="yes"
                    className="rounded-xl border px-3 py-3 text-base"
                    style={{
                        backgroundColor: theme.inputBg,
                        borderColor: passwordError ? theme.dangerBorder : theme.inputBorder,
                        color: theme.text,
                    }}
                />
                <View className="mt-1 mb-1 min-h-[18px]">
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

            <View className="mb-2 items-end">
                <TouchableOpacity
                    onPress={() => router.push("/forgot-password")}
                    activeOpacity={0.7}
                >
                    <Text
                        className="text-sm font-semibold"
                        style={{ color: theme.linkText }}
                    >
                        {t("forgotPassword")}
                    </Text>
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => {
                    if (!isDisabled) {
                        setKeepSignedIn(!keepSignedIn);
                    }
                }}
                className="mb-4 flex-row items-center p-1"
                accessibilityRole="checkbox"
                accessibilityState={{
                    checked: keepSignedIn,
                    disabled: isDisabled,
                }}
            >
                <Checkbox
                    value={keepSignedIn}
                    color={keepSignedIn ? "#111827" : undefined}
                    style={{
                        width: 22,
                        height: 22,
                        borderColor: theme.border,
                        borderWidth: 1,
                        borderRadius: 4,
                    }}
                />
                <Text
                    className="ml-2 text-s"
                    style={{ color: theme.textMuted }}
                >
                    {t("keepMeSignedIn")}
                </Text>
            </TouchableOpacity>

            <Text className="mb-4 text-sm" style={{ color: theme.text }}>
                {t("newUser")}{" "}
                <Text
                    className="font-semibold"
                    style={{
                        color: isDisabled ? theme.linkTextDisabled : theme.linkText,
                    }}
                    onPress={isDisabled ? undefined : onToggleAuth}
                >
                    {t("createAccount")}
                </Text>
            </Text>

            <PrimaryButton
                label={t("loginButton")}
                onPress={handleLogin}
                loading={isLoading}
                disabled={isDisabled}
            />

            <View className="mt-2 mb-2 min-h-[18px] items-center justify-center">
                {loginError ? (
                    <Text
                        className="text-center text-lg"
                        style={{ color: theme.dangerText }}
                    >
                        {loginError}
                    </Text>
                ) : null}
            </View>

            <View className="mb-4 flex-row items-center">
                <View
                    className="h-[1px] flex-1"
                    style={{ backgroundColor: theme.divider }}
                />

                <Text
                    className="mx-3 text-xs uppercase tracking-[0.12em]"
                    style={{ color: theme.labelText }}
                >
                    {t("orSignupWith")}
                </Text>

                <View
                    className="h-[1px] flex-1"
                    style={{ backgroundColor: theme.divider }}
                />
            </View>

            <TouchableOpacity
                disabled={isDisabled}
                className={`flex-row items-center justify-center rounded-2xl border py-2.5 ${isDisabled ? "opacity-60" : ""}`}
                style={{
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                }}
                activeOpacity={0.85}
                accessibilityRole="button"
                accessibilityLabel={t("signinWithGoogle")}
            >
                <Image
                    source={require("@/assets/images/google.png")}
                    style={{ width: 20, height: 20, marginRight: 10 }}
                    resizeMode="contain"
                />

                <Text
                    className="text-base font-medium"
                    style={{ color: theme.text }}
                >
                    {t("signinWithGoogle")}
                </Text>
            </TouchableOpacity>
        </AuthCard>
    );
}