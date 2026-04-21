// app/(auth)/auth.tsx
import { LoginCard } from "@/components/auth/LoginCard";
import { SignupCard } from "@/components/auth/SignupCard";
import React, { useRef, useState } from "react";
import {
    Animated,
    Easing,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AuthScreen() {
    const [activeForm, setActiveForm] = useState<"login" | "signup">("login");

    const loginFade = useRef(new Animated.Value(1)).current;
    const signupFade = useRef(new Animated.Value(0)).current;

    function switchForm(nextForm: "login" | "signup") {
        const showLogin = nextForm === "login";

        setActiveForm(nextForm);

        Animated.parallel([
            Animated.timing(loginFade, {
                toValue: showLogin ? 1 : 0,
                duration: 220,
                easing: Easing.out(Easing.ease),
                useNativeDriver: Platform.OS !== "web",
            }),
            Animated.timing(signupFade, {
                toValue: showLogin ? 0 : 1,
                duration: 220,
                easing: Easing.out(Easing.ease),
                useNativeDriver: Platform.OS !== "web",
            }),
        ]).start();
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
                                    pointerEvents={activeForm === "login" ? "auto" : "none"}
                                    style={[
                                        {
                                            position: "absolute",
                                            width: "100%",
                                            zIndex: activeForm === "login" ? 2 : 1,
                                        },
                                        loginStyle,
                                    ]}
                                >
                                    <LoginCard
                                        onRequestSignup={() => switchForm("signup")}
                                        disabledLinks={false}
                                    />
                                </Animated.View>

                                <Animated.View
                                    pointerEvents={activeForm === "signup" ? "auto" : "none"}
                                    style={[
                                        {
                                            position: "absolute",
                                            width: "100%",
                                            zIndex: activeForm === "signup" ? 2 : 1,
                                        },
                                        signupStyle,
                                    ]}
                                >
                                    <SignupCard
                                        onRequestLogin={() => switchForm("login")}
                                        disabledLinks={false}
                                    />
                                </Animated.View>

                                <View
                                    style={{
                                        opacity: 0,
                                        pointerEvents: "none",
                                    }}
                                >
                                    {activeForm === "login" ? (
                                        <LoginCard
                                            onRequestSignup={() => {}}
                                            disabledLinks={true}
                                        />
                                    ) : (
                                        <SignupCard
                                            onRequestLogin={() => {}}
                                            disabledLinks={true}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}