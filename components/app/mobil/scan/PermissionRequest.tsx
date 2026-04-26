// /components/scan/permissionRequest.tsx
import { DefaultCard } from "@/components/Shared/DefaultCard";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React from "react";
import { useTranslation } from "react-i18next";
import { Pressable, Text, View } from "react-native";

interface PermissionRequestProps {
    onGrant: () => void;
}

export default function PermissionRequest({ onGrant }: PermissionRequestProps) {
    const { t } = useTranslation("scan");
    const { theme } = useAppTheme();

    return (
        <View className="flex-1 items-center justify-center px-6">
            <DefaultCard>
                <Text
                    className="mb-3 text-center text-xl font-bold"
                    style={{ color: theme.text }}
                >
                    {t("CameraAccessNeeded")}
                </Text>

                <Text
                    className="mb-6 text-center text-sm"
                    style={{ color: theme.textMuted }}
                >
                    {t("CameraAccessDescription")}
                </Text>

                <View
                    className="w-full rounded-2xl"
                    style={{ backgroundColor: "red" }}
                >
                    <Pressable
                        onPress={onGrant}
                        className="px-5 py-3"
                        style={({ pressed }) => ({
                            opacity: pressed ? 0.85 : 1,
                        })}
                    >
                        <Text className="text-center text-base font-semibold text-white">
                            {t("GrantPermission")}
                        </Text>
                    </Pressable>
                </View>
            </DefaultCard>
        </View>
    );
}