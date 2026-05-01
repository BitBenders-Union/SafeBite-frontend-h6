import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Allergy } from "@/lib/types/allergy";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React from "react";
import {
    ActivityIndicator,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

type Props = {
    allergy: Allergy;
    isAdded: boolean;
    onToggle: (allergy: Allergy) => void;
    isLoading: boolean;
    translate: (key: string) => string;
};

function getSafeIconName(icon?: string | null) {
    if (!icon) return "help-circle-outline";
    if (icon === "lobster") return "space-invaders";
    return icon;
}

export const AllergyRow = React.memo(function AllergyRow({
    allergy,
    isAdded,
    onToggle,
    isLoading,
    translate: t,
}: Props) {
    const { theme } = useAppTheme();
    // we get translation from translate prop to avoid double render of the languge json. 

    return (
        <View
            className="mb-3 flex-row items-center justify-between rounded-xl border px-4 py-3 shadow-sm"
            style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
            }}
        >
            <View className="flex-row items-center">
                <View
                    className="mr-3 h-10 w-10 items-center justify-center rounded-full border"
                    style={{ borderColor: theme.border }}
                >
                    <MaterialCommunityIcons
                        name={getSafeIconName(allergy.icon) as any}
                        size={22}
                        color={theme.iconPrimary}
                    />
                </View>

                <Text
                    className="text-[15px] font-medium"
                    style={{ color: theme.text }}
                >
                    {allergy.name}
                </Text>
            </View>

            <TouchableOpacity
                onPress={() => onToggle(allergy)}
                activeOpacity={0.85}
                style={{
                    width: 80,
                    paddingVertical: 6,
                    borderRadius: 999,
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: isAdded ? "#ef4444" : "#16a34a",
                }}
            >
                {isLoading ? (
                    <ActivityIndicator
                        size="small"
                        color={theme.text}
                    />
                ) : (
                    <View className="flex-row items-center">
                        <Ionicons
                            name={isAdded ? "remove" : "add"}
                            size={14}
                            style={{ color: "#FFF" }}
                        />
                        <Text
                            className="ml-1 text-[12px] font-semibold"
                            style={{ color: "#FFF" }}
                        >
                            {isAdded ? t("remove") : t("add")}
                        </Text>
                    </View>
                )}
            </TouchableOpacity>
        </View>
    );
});