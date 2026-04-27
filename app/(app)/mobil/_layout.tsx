// /app/(app)/(mobil)/_layout.tsx
import BottomNavBar from "@/components/app/Navigation/BottomNavBar";
import TopNavBar from "@/components/app/Navigation/TopNavBar";

import { Slot } from "expo-router";
import React from "react";
import { KeyboardAvoidingView, Platform, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function MobileLayout() {

    const safeArea = useSafeAreaInsets();

    // keyboard behavior depending on device
    const keyboardBehavior = Platform.select({
        ios: "padding" as const,
        android: "height" as const,
        default: undefined,
    });

    // space to move content when keyboard opens
    const keyboardOffset = Platform.select({
        ios: 60,
        android: 80,
        default: 0,
    });

    return (
        <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
            <View style={{ flex: 1 }}>
                <TopNavBar />

                <KeyboardAvoidingView
                    style={{ flex: 1 }}
                    behavior={keyboardBehavior}
                    keyboardVerticalOffset={keyboardOffset}
                >
                    <View style={{ flex: 1 }}>
                        
                        <Slot />
                    </View>
                </KeyboardAvoidingView>

                <View style={{ paddingBottom: safeArea.bottom }}>
                    <BottomNavBar />
                </View>
            </View>
        </SafeAreaView>
    );
}