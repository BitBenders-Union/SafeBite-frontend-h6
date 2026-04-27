// /app/index.tsx
import { useAuth } from "@/lib/auth/AuthContext";
import { Redirect } from "expo-router";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
    const { user, isLoading } = useAuth();

    if (isLoading) {
        return (
            <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (!user) {
        return <Redirect href="/(auth)/auth" />;
    }

    return <Redirect href="/(app)/mobil/scan" />;
}