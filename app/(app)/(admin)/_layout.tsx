// /app/(app)/(admin)/_layout.tsx
import AdminSidebar from "@/components/app/admin/AdminSidebar";
import { useAuth } from "@/lib/auth/AuthContext";
import { useAppTheme } from "@/lib/theme/ThemeProvider";
import { Redirect, Slot } from "expo-router";
import { ActivityIndicator, Platform, View } from "react-native";

export default function AdminLayout() {
    const { theme } = useAppTheme();
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

    const isWeb = Platform.OS === "web";

    const isAdmin = user.roles.some(
        role => role.toLowerCase() === "admin"
    );

    if (!isAdmin || !isWeb) {
        return <Redirect href="/(app)/mobil/home" />;
    }

    return (
    <View
        className="flex-1 flex-row"
        style={{ backgroundColor: theme.background }}
    >
        <AdminSidebar />

        <View className="flex-1">
            <Slot />
        </View>
    </View>
);
}