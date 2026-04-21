// /components/Shared/DefaultCard.tsx
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

type DefaultCardProps = {
    children: React.ReactNode;
    className?: string;
    title?: string;
    showBackButton?: boolean;
    onBackPress?: () => void;
    backLabel?: string;
    headerSideWidthClassName?: string;
};

export function DefaultCard({
    children,
    className = "",
    title,
    showBackButton = false,
    onBackPress,
    backLabel = "Back",
    headerSideWidthClassName = "w-24",
}: DefaultCardProps) {
    const { theme } = useAppTheme();
    const hasHeader = !!title || showBackButton;

    return (
        <View
            className={["w-full rounded-3xl p-4 ", className].join(" ")}
            style={{
                backgroundColor: theme.card,
                borderColor: theme.border,
                borderWidth: 1,
                shadowColor: "#000",
                shadowOpacity: 0.10,
                shadowRadius: 18,
                shadowOffset: { width: 0, height: 10 },
            }}
        >
            {hasHeader && (
                <View className="mb-4 w-full flex-row items-center justify-center">
                    <View className={`${headerSideWidthClassName} items-start`}>
                        {showBackButton && (
                            <TouchableOpacity
                                onPress={onBackPress}
                                className="flex-row items-center rounded-full px-3 py-1.5"
                                activeOpacity={0.85}
                                style={{
                                    backgroundColor: theme.surface,
                                    borderColor: theme.border,
                                    borderWidth: 1,
                                }}
                            >
                                <Ionicons name="arrow-back" size={18} color={theme.text} />
                                <Text
                                    className="ml-2 text-xs"
                                    style={{ color: theme.text }}
                                >
                                    {backLabel}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <View
                        className="rounded-full px-4 py-2"
                        style={{
                            backgroundColor: theme.surface,
                            borderColor: theme.border,
                            borderWidth: 1,
                        }}
                    >
                        <Text
                            className="text-[16px] font-semibold"
                            style={{ color: theme.text }}
                            numberOfLines={1}
                        >
                            {title ?? ""}
                        </Text>
                    </View>

                    <View className={headerSideWidthClassName} />
                </View>
            )}

            {children}
        </View>
    );
}