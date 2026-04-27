import AdminUserConfirmModal from "@/components/app/admin/users/AdminUserConfirmModal";
import AdminUserRow from "@/components/app/admin/users/AdminUserRow";
import { mockUsers } from "@/lib/mock/mockAdminUsers";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React, { useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";

type AdminUser = {
    userId: string;
    email: string;
    roles: string[];
    isActive?: boolean;
};

type PendingAction = "makeAdmin" | "removeAdmin" | "deactivate" | "activate";

export default function AdminUserSection() {
    const { theme } = useAppTheme();

    const [userList, setUserList] = useState<AdminUser[]>(mockUsers);
    const [searchText, setSearchText] = useState("");
    const [actionError, setActionError] = useState("");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);

    const filteredUsers = useMemo(() => {
        const text = searchText.trim().toLowerCase();

        if (!text) return userList;

        return userList.filter((user) =>
            user.email.toLowerCase().includes(text)
        );
    }, [userList, searchText]);

    function openAction(user: AdminUser, action: PendingAction) {
        setActionError("");
        setSelectedUser(user);
        setPendingAction(action);
    }

    function closeActionModal() {
        setSelectedUser(null);
        setPendingAction(null);
        setActionError("");
    }

    function confirmAction() {
        if (!selectedUser || !pendingAction) return;

        if (pendingAction === "makeAdmin") {
            const alreadyAdmin = selectedUser.roles.includes("admin");

            if (alreadyAdmin) {
                setActionError("User already has admin role.");
                return;
            }

            setUserList((prev) =>
                prev.map((user) => {
                    if (user.userId !== selectedUser.userId) return user;

                    return {
                        ...user,
                        roles: [...user.roles, "admin"],
                    };
                })
            );
        }

        if (pendingAction === "removeAdmin") {
            setUserList((prev) =>
                prev.map((user) => {
                    if (user.userId !== selectedUser.userId) return user;

                    return {
                        ...user,
                        roles: user.roles.filter((role) => role !== "admin"),
                    };
                })
            );
        }

        if (pendingAction === "deactivate") {
            if (selectedUser.isActive === false) {
                setActionError("User is already inactive.");
                return;
            }

            setUserList((prev) =>
                prev.map((user) => {
                    if (user.userId !== selectedUser.userId) return user;

                    return {
                        ...user,
                        isActive: false,
                    };
                })
            );
        }

        if (pendingAction === "activate") {
            setUserList((prev) =>
                prev.map((user) => {
                    if (user.userId !== selectedUser.userId) return user;

                    return {
                        ...user,
                        isActive: true,
                    };
                })
            );
        }

        closeActionModal();
    }

    function getModalTitle() {
        if (pendingAction === "makeAdmin") return "Give admin role";
        if (pendingAction === "removeAdmin") return "Remove admin role";
        if (pendingAction === "deactivate") return "Deactivate user";
        if (pendingAction === "activate") return "Activate user";
        return "Confirm action";
    }

    function getModalText() {
        if (!selectedUser) return "";

        if (pendingAction === "makeAdmin") {
            return `Give admin role to ${selectedUser.email}?`;
        }

        if (pendingAction === "removeAdmin") {
            return `Remove admin role from ${selectedUser.email}?`;
        }

        if (pendingAction === "deactivate") {
            return `Deactivate ${selectedUser.email}?`;
        }

        if (pendingAction === "activate") {
            return `Activate ${selectedUser.email}?`;
        }

        return "";
    }

    return (
        <>
            <View
                className="mb-4 flex-row items-center rounded-xl border px-4 py-2"
                style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                }}
            >
                <TextInput
                    value={searchText}
                    onChangeText={setSearchText}
                    placeholder="Search by email"
                    placeholderTextColor={theme.textMuted}
                    className="flex-1 text-sm"
                    style={{ color: theme.text }}
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(user) => user.userId}
                renderItem={({ item }) => (
                    <AdminUserRow
                        user={item}
                        onMakeAdmin={(pickedUser) =>
                            openAction(pickedUser, "makeAdmin")
                        }
                        onRemoveAdmin={(pickedUser) =>
                            openAction(pickedUser, "removeAdmin")
                        }
                        onDeactivate={(pickedUser) =>
                            openAction(pickedUser, "deactivate")
                        }
                        onActivate={(pickedUser) =>
                            openAction(pickedUser, "activate")
                        }
                    />
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text
                        className="py-4 text-center text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        No users match your search
                    </Text>
                }
            />

            <AdminUserConfirmModal
                visible={!!selectedUser && !!pendingAction}
                title={getModalTitle()}
                message={getModalText()}
                error={actionError}
                onCancel={closeActionModal}
                onConfirm={confirmAction}
            />
        </>
    );
}