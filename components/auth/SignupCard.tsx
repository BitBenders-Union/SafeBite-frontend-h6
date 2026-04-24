import { AuthCard } from "@/components/Shared/AuthCard";
import { PrimaryButton } from "@/components/Shared/PrimaryButton";
import { useAuth } from "@/lib/auth/AuthContext";
import { hasSignupErrors, validateSignupForm } from "@/lib/auth/authValidation";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { SignupRequest } from "@/lib/types/auth";
import { Checkbox } from "expo-checkbox";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Alert,
    Text,
    TextInput,
    View
} from "react-native";
import { TosModal } from "../Shared/TosModal";


type Props = {
    onRequestLogin: () => void;
    disabledLinks?: boolean;
};



export function SignupCard({
    onRequestLogin,
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
    const [tosError, setTosError] = useState("");

    const [isLoading, setIsLoading] = useState(false);

    const isDisabled = isLoading || disabledLinks;

    async function handleSignup() {

        if (isDisabled) return;

      
        setEmailError("");
        setPasswordError("");
        setConfirmPasswordError("");
        setTosError("");

        const errors = validateSignupForm(email, password, confirmPassword);

        setEmailError(errors.emailError ? t(errors.emailError) : "");
        setPasswordError(errors.passwordError ? t(errors.passwordError) : "");
        setConfirmPasswordError(
            errors.confirmPasswordError ? t(errors.confirmPasswordError) : ""
        );

        if (hasSignupErrors(errors)) {
            return;
        }

        if (!hasAcceptedTos) {
            setTosError(t("acceptDisclaimerError"));
            return;
        }

        try {

            setIsLoading(true);

            const signupData: SignupRequest = {
                email,
                password,
            };

            await signUp(signupData);

            Alert.alert(t("AccountCreatedSuccessfully"));
            onRequestLogin();

        } catch (error: any) {

            Alert.alert(t("Error"), error.message || t("SignupFailed"));

        } finally {

            setIsLoading(false);

        }
    }

    return (
        <AuthCard>
            <View className="mb-6 items-center justify-center">
                <Text className="text-xl font-semibold"
                    style={{ color: theme.text }}>
                    {t("signupTitle")}
                </Text>

                <Text className="mt-1 text-center text-sm"
                    style={{ color: theme.textMuted }}>
                    {t("signupSubtitle")}
                </Text>
            </View>

            {/* First/last name row */}
            {/* <View className="flex-row gap-3 mb-4  ">
                <View className="flex-1">
                    <TextInput
                        value={firstName}
                        onChangeText={(text) => {
                            setFirstName(text);
                            if (firstNameError) setFirstNameError("");
                        }}
                        editable={!disabledLinks}
                        placeholder={t("firstNamePlaceholder") || "Fornavn"}
                        placeholderTextColor="#6b7280"
                        className={`border rounded-xl px-3 py-3 text-base `}
                        style={{
                            backgroundColor: theme.inputBg,
                            color: theme.text,
                            borderColor: firstNameError ? theme.dangerBorder : theme.inputBorder,
                        }}
                    />
                    <View className="min-h-[18px] mt-1">
                        {firstNameError ? (
                            <Text className="text-xs"
                                style={{ color: theme.dangerText }}>{firstNameError}</Text>
                        ) : null}
                    </View>
                </View>
                <View className="flex-1">
                    <TextInput
                        value={lastName}
                        onChangeText={(text) => {
                            setLastName(text);
                            if (lastNameError) setLastNameError("");
                        }}
                        editable={!disabledLinks}
                        placeholder={t("lastNamePlaceholder") || "Efternavn"}
                        placeholderTextColor="#6b7280"
                        className={`border rounded-xl px-3 py-3 text-base `}
                        style={{
                            backgroundColor: theme.inputBg,
                            color: theme.text,
                            borderColor: lastNameError ? theme.dangerBorder : theme.inputBorder,
                        }}
                    />
                    <View className="min-h-[18px] mt-1">
                        {lastNameError ? (
                            <Text className="text-xs" style={{ color: theme.dangerText }} >{lastNameError}</Text>
                        ) : null}
                    </View>
                </View>
            </View> */}

            {/* Email */}
            <View className="mb-4">
                <TextInput
                    value={email}
                    onChangeText={(text) => {
                        setEmail(text);
                        if (emailError) setEmailError("");
                    }}
                    editable={!disabledLinks}
                    placeholder={t("emailPlaceholder") || "Email"}
                    placeholderTextColor="#6b7280"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    className={`border rounded-xl px-3 py-3 text-base`}
                    style={{
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: emailError ? theme.dangerBorder : theme.inputBorder,
                    }}
                />
                <View className="min-h-[18px] mt-1 mb-1">
                    {emailError ? (
                        <Text className="text-xs" style={{ color: theme.dangerText }}>{emailError}</Text>
                    ) : null}
                </View>
            </View>

            {/* Password */}
            <View className="mb-2">
                <TextInput
                    value={password}
                    onChangeText={(text) => {
                        setPassword(text);
                        if (passwordError) setPasswordError("");
                    }}
                    editable={!disabledLinks}
                    placeholder={t("passwordPlaceholder") || "Password"}
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    className={`border rounded-xl px-3 py-3 text-base `}
                    style={{
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: passwordError ? theme.dangerBorder : theme.inputBorder,
                    }}

                />
                <View className="min-h-[18px] mt-1 mb-1">
                    {passwordError ? (
                        <Text className="text-xs" style={{ color: theme.dangerText }}>
                            {passwordError}
                        </Text>
                    ) : (
                        <Text className="text-transparent text-xs"></Text>
                    )}
                </View>
            </View>

            {/* Confirm Password */}
            <View className="mb-4">
                <TextInput
                    value={confirmPassword}
                    onChangeText={(text) => {
                        setConfirmPassword(text);
                        if (confirmPasswordError) setConfirmPasswordError("");
                    }}
                    editable={!disabledLinks}
                    placeholder={t("confirmPasswordPlaceholder") || "Bekræft adgangskode"}
                    placeholderTextColor="#6b7280"
                    secureTextEntry
                    className={`border rounded-xl px-3 py-3 text-base `}
                    style={{
                        backgroundColor: theme.inputBg,
                        color: theme.text,
                        borderColor: confirmPasswordError ? theme.dangerBorder : theme.inputBorder,
                    }}
                />
                <View className="min-h-[18px] mt-1 mb-1">
                    {confirmPasswordError ? (
                        <Text className="text-xs" style={{ color: theme.dangerText }}>
                            {confirmPasswordError}
                        </Text>
                    ) : null}
                </View>
            </View>

            {/* Already have account */}
            <Text className="text-center mb-4 text-sm" style={{ color: theme.textMuted }}>
                {t("alreadyHaveUser")}{" "}
                <Text
                    className="font-semibold"
                    style={{ color: isDisabled ? theme.linkTextDisabled : theme.linkText }}
                    onPress={isDisabled ? undefined : onRequestLogin}
                >
                    {t("loginButton") || "Log ind"}
                </Text>
            </Text>

            {/* Tos */}
            <View className="mb-4">
                <View className="flex-row items-start">
                    <Checkbox
                        value={hasAcceptedTos}
                        onValueChange={(value) => {
                            setHasAcceptedTos(value);
                            if (tosError) setTosError("");
                        }}
                        disabled={isDisabled}
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
                                style={{ color: isDisabled ? theme.textMuted : theme.linkText }}
                                onPress={isDisabled ? undefined : () => setShowTosModal(true)}
                            >
                                {t("acceptDisclaimerLink")}
                            </Text>
                        </Text>
                    </View>
                </View>

                <View className="min-h-[18px] mt-1">
                    {tosError ? (
                        <Text
                            className="text-xs"
                            style={{ color: theme.dangerText }}
                        >
                            {tosError}
                        </Text>
                    ) : null}
                </View>
            </View>

            <PrimaryButton
                label={t("signupButton")}
                onPress={handleSignup}
                loading={isLoading}
                disabled={isDisabled}
            />

            <TosModal
                visible={showTosModal}
                onClose={() => setShowTosModal(false)}
                onAccept={() => {
                    setHasAcceptedTos(true);
                    setShowTosModal(false);
                    if (tosError) setTosError("");
                }}
            />

        </AuthCard>
    );
}