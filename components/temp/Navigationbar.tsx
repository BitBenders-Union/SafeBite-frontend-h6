// /components/temp/Navigationbar.tsx
import { router } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export function Navigationbar() {
    return (
        <View className="flex-row gap-2 p-3 bg-neutral-200">

            <TouchableOpacity
                onPress={() => router.push("/(auth)/auth")}
                className="px-3 py-2 bg-blue-500 rounded-lg"
            >
                <Text className="text-white">Auth</Text>
            </TouchableOpacity>

            <TouchableOpacity
                onPress={() => router.push("/(app)/mobil/home")}
                className="px-3 py-2 bg-green-500 rounded-lg"
            >
                <Text className="text-white">App</Text>
            </TouchableOpacity>

        </View>
    );
}