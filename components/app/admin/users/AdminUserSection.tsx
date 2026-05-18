// /components/app/admin/users/AdminUserSection.tsx

import AdminUserConfirmModal from "@/components/app/admin/users/AdminUserConfirmModal";
import AdminUserRow from "@/components/app/admin/users/AdminUserRow";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { UserList, UserRole } from "@/lib/types/user";
import { activateUser, deactivateUser, getAllUsersAndRoles, removeRole, setRole } from "@/services/api/adminUserManagementApi";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, Text, TextInput, View } from "react-native";

type ActionType = "makeAdmin" | "removeAdmin" | "deactivate" | "activate";

export default function AdminUserSection() {
    const { t } = useTranslation("adminusers");
    const { theme } = useAppTheme();

    const [userList, setUserList] = useState<UserList[]>([]);
    const [searchText, setSearchText] = useState("");
    const [Error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setIsLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        loadUsers(signal);
        
        return () => {
            controller.abort();
        };
    }, []);

    async function loadUsers(signal?: AbortSignal) {
        try {
            setErrorMessage("");
            setIsLoading(true);

            const data = await getAllUsersAndRoles(signal);
            setUserList(data);
        }
        catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setErrorMessage(err.message || t("errors.failedToLoadUsers"));
        }
        finally {
            setIsLoading(false);
        }
    }

    const filteredUsers = useMemo(() => {
        const text = searchText.trim().toLowerCase();
        if (!text) return userList;
        return userList.filter((user) =>
            user.email.toLowerCase().includes(text)
        );
    }, [userList, searchText]);

    function showModal(user: UserList, action: ActionType) {
        setError("");
        setSelectedUser(user);
        setSelectedAction(action);
    }

    function closeModal() {
        setSelectedUser(null);
        setSelectedAction(null);
        setError("");
    }

    async function onSave() {
        if (!selectedUser || !selectedAction) return;

        const userrole: UserRole = {
            userID: selectedUser.id,
            roleName: "Admin"
        };

        if (selectedAction === "makeAdmin") {
            const alreadyAdmin = selectedUser.roles.some((r) => r.roleName === "Admin");

            if (alreadyAdmin) {
                setError(t("errors.alreadyAdmin"));
                return;
            }

            try {
                await setRole(userrole);
                await loadUsers();
            }
            catch (err) {
                setError(t("errors.failedToMakeAdmin"));
            }
        }

        if (selectedAction === "removeAdmin") {
            try {
                await removeRole(userrole);
                await loadUsers();
            }
            catch (err) {
                setError(t("errors.failedToRemoveAdmin"));
            }
        }

        if (selectedAction === "deactivate") {
            if (selectedUser.isActive === false) {
                setError(t("errors.alreadyInactive"));
                return;
            }

            try {
                await deactivateUser(selectedUser.id);
                await loadUsers();
            }
            catch (err) {
                setError(t("errors.failedToDeactivate"));
            }
        }

        if (selectedAction === "activate") {
            try {
                await activateUser(selectedUser.id);
                await loadUsers();
            }
            catch (err) {
                setError(t("errors.failedToActivate"));
            }
        }

        closeModal();
    }

    function getModalTitle() {
        if (selectedAction === "makeAdmin") return t("modal.makeAdminTitle");
        if (selectedAction === "removeAdmin") return t("modal.removeAdminTitle");
        if (selectedAction === "deactivate") return t("modal.deactivateTitle");
        if (selectedAction === "activate") return t("modal.activateTitle");
        return t("modal.defaultTitle");
    }

    function getModalText() {
        if (!selectedUser) return "";

        if (selectedAction === "makeAdmin") {
            return t("modal.makeAdminMessage");
        }
        if (selectedAction === "removeAdmin") {
            return t("modal.removeAdminMessage");
        }
        if (selectedAction === "deactivate") {
            return t("modal.deactivateMessage");
        }
        if (selectedAction === "activate") {
            return t("modal.activateMessage");
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
                    placeholder={t("searchPlaceholder")}
                    placeholderTextColor={theme.textMuted}
                    className="flex-1 text-sm"
                    style={{ color: theme.text }}
                />
            </View>

            <FlatList
                data={filteredUsers}
                keyExtractor={(user) => user.id}
                renderItem={({ item }) => (
                    <AdminUserRow
                        user={item}
                        onMakeAdmin={(pickedUser) => showModal(pickedUser, "makeAdmin")}
                        onRemoveAdmin={(pickedUser) => showModal(pickedUser, "removeAdmin")}
                        onDeactivate={(pickedUser) => showModal(pickedUser, "deactivate")}
                        onActivate={(pickedUser) => showModal(pickedUser, "activate")}
                    />
                )}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={
                    <Text
                        className="py-4 text-center text-sm"
                        style={{ color: theme.textMuted }}
                    >
                        {t("noResults")}
                    </Text>
                }
            />

            <AdminUserConfirmModal
                visible={!!selectedUser && !!selectedAction}
                title={getModalTitle()}
                message={getModalText()}
                error={Error}
                onCancel={closeModal}
                onConfirm={onSave}
            />
        </>
    );
}