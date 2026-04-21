// /components/Shared/PrimaryButton.tsx

import React from "react";
import { ActivityIndicator, Text, TouchableOpacity } from "react-native";

import { useAppTheme } from "@/lib/theme/useAppTheme";

type Props = {
    label: string;
    onPress: () => void;
    loading?: boolean;
    disabled?: boolean;
    className?: string;
};

export function PrimaryButton({
    label,
    onPress,
    loading = false,
    disabled = false,
    className = "",
}: Props) {
    const { theme } = useAppTheme();

    const isDisabled = disabled || loading;

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={isDisabled}
            activeOpacity={0.8}
            accessibilityRole="button"
            accessibilityLabel={label}
            accessibilityState={{ disabled: isDisabled }}
            className={`mb-4 items-center justify-center rounded-2xl py-3 ${className}`}
            style={{
                backgroundColor: isDisabled
                    ? theme.border
                    : theme.buttonPrimaryBg,
            }}
        >
            {loading ? (
                <ActivityIndicator color={theme.buttonPrimaryText} />
            ) : (
                <Text
                    className="text-base font-semibold"
                    style={{ color: theme.buttonPrimaryText }}
                >
                    {label}
                </Text>
            )}
        </TouchableOpacity>
    );
}