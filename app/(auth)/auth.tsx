// /app/(auth)/auth.tsx
import { LoginCard } from "@/components/auth/LoginCard";
import { SignupCard } from "@/components/auth/SignupCard";
import { useAppTheme } from "@/lib/theme/ThemeProvider";
import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

let signUpResultBackup: boolean | null = null;

export default function AuthScreen() {
    const { t } = useTranslation("auth");
    const { theme } = useAppTheme();

    const [isLogin, setIsLogin] = useState(true);
    const [signUpResult, setSignUpResult] = useState<boolean | undefined>(undefined);

    const loginFade = useRef(new Animated.Value(1)).current;
    const signupFade = useRef(new Animated.Value(0)).current;

    const runAnimation = (toLogin: boolean) => {
        Animated.parallel([
            Animated.timing(loginFade, {
                toValue: toLogin ? 1 : 0,
                duration: 220,
                easing: Easing.out(Easing.ease),
                useNativeDriver: Platform.OS !== "web",
            }),
            Animated.timing(signupFade, {
                toValue: toLogin ? 0 : 1,
                duration: 220,
                easing: Easing.out(Easing.ease),
                useNativeDriver: Platform.OS !== "web",
            }),
        ]).start();
    };

    function toggleAuthMode(isSuccess?: boolean) {

        if (isSuccess === true) {
            signUpResultBackup = true;
            setSignUpResult(true);
            setIsLogin(true);
            runAnimation(true);
        }
        else if (isSuccess === false) {
            signUpResultBackup = false;
            setSignUpResult(false);
            setIsLogin(true);
            runAnimation(true);
        }
        else {
            signUpResultBackup = null;
            setSignUpResult(undefined);
            const nextMode = !isLogin;
            setIsLogin(nextMode);
            runAnimation(nextMode);
        }
    }

    function makeCardStyle(animValue: Animated.Value) {
        return {
            opacity: animValue,
            transform: [
                {
                    scale: animValue.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.96, 1],
                    }),
                },
            ],
        };
    }

    const loginStyle = makeCardStyle(loginFade);
    const signupStyle = makeCardStyle(signupFade);

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
                            <View className="relative">
                                <Animated.View
                                    pointerEvents={isLogin ? "auto" : "none"}
                                    style={[
                                        {
                                            width: "100%",
                                            zIndex: isLogin ? 2 : 1,
                                        },
                                        loginStyle,
                                    ]}
                                >
                                    <LoginCard
                                        key="stable-login-card"
                                        onToggleAuth={() => toggleAuthMode()}
                                        disabledLinks={false}
                                        signUpResult={signUpResult !== undefined ? signUpResult : (signUpResultBackup ?? undefined)}
                                    />
                                </Animated.View>

                                <Animated.View
                                    pointerEvents={!isLogin ? "auto" : "none"}
                                    style={[
                                        {
                                            position: "absolute",
                                            top: 0,
                                            width: "100%",
                                            zIndex: !isLogin ? 2 : 1,
                                        },
                                        signupStyle,
                                    ]}
                                >
                                    <SignupCard
                                        onSignUpResult={toggleAuthMode}
                                        disabledLinks={false}
                                    />
                                </Animated.View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}