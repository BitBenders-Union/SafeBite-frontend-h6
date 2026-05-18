// /components/auth/SignupCard.tsx
import { AuthCard } from "@/components/Shared/AuthCard";
import { PrimaryButton } from "@/components/Shared/PrimaryButton";
import { useAuth } from "@/lib/auth/AuthContext";
import {
    hasSignupErrors,
    validateConfirmPassword,
    validateEmail,
    validatePassword,
    validateSignupForm,
} from "@/lib/auth/authValidation";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { SignupRequest } from "@/lib/types/auth";
import { Checkbox } from "expo-checkbox";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Text,
    TextInput,
    View
} from "react-native";
import { TosModal } from "../Shared/TosModal";

type Props = {
    onSignUpResult:(success?: boolean) => void;
    disabledLinks?: boolean;
};

export function SignupCard({
    onSignUpResult,
    disabledLinks = false,
}: Props) {

    const { theme } = useAppTheme();
    const { t } = useTranslation("auth");
    const { signUp } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [confirmPasswordError, setConfirmPasswordError] = useState("");

    const [hasAcceptedTos, setHasAcceptedTos] = useState(false);
    const [showTosModal, setShowTosModal] = useState(false);

    const [isLoading, setIsLoading] = useState(false);

    const isFormDisabled = isLoading || disabledLinks;

    const emailIsValid = !validateEmail(email);
    const passwordIsValid = !validatePassword(password);
    const confirmPasswordIsValid = !validateConfirmPassword(password, confirmPassword);

    const isSignupDisabled =
        isFormDisabled ||
        !emailIsValid ||
        !passwordIsValid ||
        !confirmPasswordIsValid ||
        !hasAcceptedTos;

    function checkEmail() {
        const error = validateEmail(email);
        setEmailError(error ? t(error) : "");
    }

    function checkPassword() {
        const error = validatePassword(password);
        setPasswordError(error ? t(error) : "");

        if (confirmPassword) {
            const confirmError = validateConfirmPassword(password, confirmPassword);
            setConfirmPasswordError(confirmError ? t(confirmError) : "");
        }
    }

    function checkConfirmPassword() {
        const error = validateConfirmPassword(password, confirmPassword);
        setConfirmPasswordError(error ? t(error) : "");
    }

    async function signupUser() {
        if (isSignupDisabled) return;

        const errors = validateSignupForm(email, password, confirmPassword);

        setEmailError(errors.emailError ? t(errors.emailError) : "");
        setPasswordError(errors.passwordError ? t(errors.passwordError) : "");
        setConfirmPasswordError(
            errors.confirmPasswordError ? t(errors.confirmPasswordError) : ""
        );

        if (hasSignupErrors(errors)) {
            return;
        }

        try {
            setIsLoading(true);

            const signupData: SignupRequest = {
                email,
                password,
            };

            await signUp(signupData);

            onSignUpResult(true);

        } catch (error: any) {
            onSignUpResult(false);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <AuthCard>
            <View className="mb-6 items-center justify-center">
                <Text
                    className="text-xl font-semibold"
                    style={{ color: theme.text }}
                >
                    {t("signupTitle")}
                </Text>

                <Text
                    className="mt-1 text-center text-sm"
                    style={{ color: theme.textMuted }}
                >
                    {t("signupSubtitle")}
                </Text>
            </View>

            <View className="mb-4">
                <TextInput
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError("");
                    }}
                    onBlur={checkEmail}
                    editable={!isFormDisabled}
                    placeholder={t("emailPlaceholder") || "Email"}
                    placeholderTextColor="#6b7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className="border rounded-xl px-3 py-3 text-base"
                    style={{
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: emailError ? theme.dangerBorder : theme.inputBorder,
                    }}
                />

                <View className="min-h-[18px] mt-1 mb-1">
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
                    onBlur={checkPassword}
                    editable={!isFormDisabled}
                    placeholder={t("passwordPlaceholder") || "Password"}
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    className="border rounded-xl px-3 py-3 text-base"
                    style={{
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: passwordError ? theme.dangerBorder : theme.inputBorder,
                    }}
                />

                <View className="min-h-[18px] mt-1 mb-1">
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

            <View className="mb-4">
                <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (confirmPasswordError) setConfirmPasswordError("");
                    }}
                    onBlur={checkConfirmPassword}
                    editable={!isFormDisabled}
                    placeholder={t("confirmPasswordPlaceholder") || "Bekræft adgangskode"}
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    className="border rounded-xl px-3 py-3 text-base"
                    style={{
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: confirmPasswordError
                            ? theme.dangerBorder
                            : theme.inputBorder,
                    }}
                />

                <View className="min-h-[18px] mt-1 mb-1">
                    {confirmPasswordError ? (
                        <Text
                            className="text-xs"
                            style={{ color: theme.dangerText }}
                        >
                            {confirmPasswordError}
                        </Text>
                    ) : null}
                </View>
            </View>

            <Text
                className="text-center mb-4 text-sm"
                style={{ color: theme.textMuted }}
            >
                {t("alreadyHaveUser")}{" "}
                <Text
                    className="font-semibold"
                    style={{
                        color: isFormDisabled
                            ? theme.linkTextDisabled
                            : theme.linkText,
                    }}
                    onPress={isFormDisabled ? undefined : () => onSignUpResult(false)}
                >
                    {t("loginButton") || "Log ind"}
                </Text>
            </Text>

            <View className="mb-4">
                <View className="flex-row items-start">
                    <Checkbox
                        value={hasAcceptedTos}
                        onValueChange={(value) => {
                            setHasAcceptedTos(value);
                        }}
                        disabled={isFormDisabled}
                        style={{ marginTop: 2 }}
                    />

                    <View className="ml-3 flex-1">
                        <Text
                            className="text-sm leading-5"
                            style={{ color: theme.textMuted }}
                        >
                            {t("acceptDisclaimerPrefix")}{" "}
                            <Text
                                className="font-semibold"
                                style={{
                                    color: isFormDisabled
                                        ? theme.textMuted
                                        : theme.linkText,
                                }}
                                onPress={
                                    isFormDisabled
                                        ? undefined
                                        : () => setShowTosModal(true)
                                }
                            >
                                {t("acceptDisclaimerLink")}
                            </Text>
                        </Text>
                    </View>
                </View>
            </View>

            <PrimaryButton
                label={t("signupButton")}
                onPress={signupUser}
                loading={isLoading}
                disabled={isSignupDisabled}
            />

            <TosModal
                visible={showTosModal}
                onClose={() => setShowTosModal(false)}
                onAccept={() => {
                    setHasAcceptedTos(true);
                    setShowTosModal(false);
                }}
            />
        </AuthCard>
    );
}