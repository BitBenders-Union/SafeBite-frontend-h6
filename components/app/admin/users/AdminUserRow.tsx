// /components/app/admin/AdminUserRow.tsx

import { useAppTheme } from "@/lib/theme/useAppTheme";
import { UserList } from "@/lib/types/user";
import React from "react";
import { useTranslation } from "react-i18next";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
    user: UserList;
    onMakeAdmin: (user: UserList) => void;
    onRemoveAdmin: (user: UserList) => void;
    onDeactivate: (user: UserList) => void;
    onActivate: (user: UserList) => void;
};

export default function AdminUserRow({
    user,
    onMakeAdmin,
    onRemoveAdmin,
    onDeactivate,
    onActivate,
}: Props) {
    const { t } = useTranslation("adminusers");
    const { theme } = useAppTheme();

    const isAdmin = user.roles.some(r => r.roleName === "Admin");
    const isActive = user.isActive !== false;

    return (
        <View
            className="mb-3 flex-row items-center justify-between rounded-xl border px-4 py-3"
            style={{
                backgroundColor: theme.inputBg,
                borderColor: theme.inputBorder,
            }}
        >
            {/* Info side */}
            <View className="flex-1 pr-3">
                <Text
                    className="text-[15px] font-medium"
                    style={{ color: theme.text }}
                >
                    {user.email}
                </Text>

                <Text
                    className="mt-1 text-xs"
                    style={{ color: theme.textMuted }}
                >
                    UserId: {user.id}
                    <br />
                    {t("userRow.roles")} {user.roles.map(r => r.roleName).join(", ")}
                </Text>

                <Text
                    className="mt-1 text-xs"
                    style={{
                        color: isActive
                            ? theme.successText
                            : theme.dangerText,
                    }}
                >
                    {isActive ? t("userRow.statusActive") : t("userRow.statusInactive")}
                </Text>
            </View>

            {/* Button side */}
            <View className="flex-col items-end gap-2 ">
                {isAdmin ? (
                    <TouchableOpacity
                        onPress={() => onRemoveAdmin(user)}
                        className="w-[120px] items-center rounded-full px-3 py-2"
                        style={{ backgroundColor: theme.activeSoft }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: theme.active }}
                        >
                            {t("userRow.removeAdmin")}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => onMakeAdmin(user)}
                        className="w-[120px] items-center rounded-full px-3 py-2"
                        style={{ backgroundColor: theme.activeSoft }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: theme.active }}
                        >
                            {t("userRow.makeAdmin")}
                        </Text>
                    </TouchableOpacity>
                )}

                {isActive ? (
                    <TouchableOpacity
                        onPress={() => onDeactivate(user)}
                        className="w-[120px] items-center rounded-full px-3 py-2"
                        style={{
                            backgroundColor: theme.dangerBg,
                            borderWidth: 1,
                            borderColor: theme.dangerBorder,
                        }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: theme.dangerText }}
                        >
                            {t("userRow.deactivate")}
                        </Text>
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity
                        onPress={() => onActivate(user)}
                        className="w-[120px] items-center rounded-full px-3 py-2"
                        style={{ backgroundColor: theme.activeSoft }}
                    >
                        <Text
                            className="text-xs font-semibold"
                            style={{ color: theme.active }}
                        >
                            {t("userRow.activate")}
                        </Text>
                    </TouchableOpacity>
                )}
            </View>
        </View>
    );
}