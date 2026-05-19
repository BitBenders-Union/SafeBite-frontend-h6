// /app/_layout.tsx
import "@/global.css";
import "@/lib/i18n/languageSetup";

import { AuthState, useAuth } from "@/lib/auth/AuthContext";
import { loadSavedLanguage } from "@/lib/i18n/languageSetup";
import { ThemeProvider } from "@/lib/theme/ThemeProvider";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, View } from "react-native";

function Gate() {
    const { user, isLoading } = useAuth();
    const segments = useSegments();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        const root = segments[0];

        if (!user && root !== "(auth)") {
            router.replace("/(auth)/auth");
            return;
        }

        if (user && root === "(auth)") {
            router.replace("/(app)/mobil/home");
            return;
        }
    }, [isLoading, user, segments, router]);

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator />
            </View>
        );
    }

    return <Slot />;
}

function AppShell() {
    const { theme, themeReady } = useAppTheme();
    const [languageReady, setLanguageReady] = useState(false);

    useEffect(() => {
        async function prepareApp() {
            await loadSavedLanguage();
            setLanguageReady(true);
        }

        prepareApp();
    }, []);

    if (!themeReady || !languageReady) {
        return null;
    }

    return (
        <LinearGradient
            colors={theme.gradient.colors}
            start={theme.gradient.start}
            end={theme.gradient.end}
            style={{ flex: 1 }}
        >
            <View className="flex-1">
                <Gate />
            </View>
        </LinearGradient>
    );
}

export default function RootLayout() {
    return (
        <ThemeProvider>
            <AuthState>
                <AppShell />
            </AuthState>
        </ThemeProvider>
    );
}