// /components/app/admin/users/AdminUserSection.tsx

import AdminUserConfirmModal from "@/components/app/admin/users/AdminUserConfirmModal";
import AdminUserRow from "@/components/app/admin/users/AdminUserRow";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { UserList, UserRole } from "@/lib/types/user";
import { activateUser, deactivateUser, getAllUsersAndRoles, removeRole, setRole } from "@/services/api/adminUserManagementApi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from "react-native";

type ActionType = "makeAdmin" | "removeAdmin" | "deactivate" | "activate";

export default function AdminUserSection() {
    const { t } = useTranslation("adminusers");
    const { theme } = useAppTheme();

    const [userList, setUserList] = useState<UserList[]>([]);
    const [searchText, setSearchText] = useState("");
    const [Error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setIsLoading] = useState(true);

    // Pagination States
    const [currentPage, setCurrentPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [hasPreviousPage, setHasPreviousPage] = useState(false);

    const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);

    // Effect triggers when page OR search text updates
    useEffect(() => {
        const controller = new AbortController();
        const signal = controller.signal;

        const delayDebounceFn = setTimeout(() => {
            loadUsers(currentPage, searchText, signal);
        }, 500);

        return () => {
            clearTimeout(delayDebounceFn);
            controller.abort();
        };
    }, [currentPage, searchText]);

    const handleSearchChange = (text: string) => {
        setCurrentPage(1);
        setSearchText(text);
    };

    async function loadUsers(page: number, search: string, signal?: AbortSignal) {
        try {
            setErrorMessage("");
            setIsLoading(true);

            const response = await getAllUsersAndRoles(page, 20, search.trim(), signal);
            
            setUserList(response.data || []);
            setHasNextPage(response.hasNextPage);
            setHasPreviousPage(response.hasPreviousPage);
        }
        catch (err: any) {
            if (err.name === "CanceledError" || err.name === "AbortError") return;
            setErrorMessage(err.message || t("failedToLoadUsers"));
        }
        finally {
            setIsLoading(false);
        }
    }

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
                setError(t("alreadyAdmin"));
                return;
            }
            try {
                await setRole(userrole);
                await loadUsers(currentPage, searchText);
            } catch { setError(t("failedToMakeAdmin")); }
        }

        if (selectedAction === "removeAdmin") {
            try {
                await removeRole(userrole);
                await loadUsers(currentPage, searchText);
            } catch { setError(t("failedToRemoveAdmin")); }
        }

        if (selectedAction === "deactivate") {
            if (selectedUser.isActive === false) {
                setError(t("alreadyInactive"));
                return;
            }
            try {
                await deactivateUser(selectedUser.id);
                await loadUsers(currentPage, searchText);
            } catch { setError(t("failedToDeactivate")); }
        }

        if (selectedAction === "activate") {
            try {
                await activateUser(selectedUser.id);
                await loadUsers(currentPage, searchText);
            } catch { setError(t("failedToActivate")); }
        }

        closeModal();
    }

    function getModalTitle() {
        if (selectedAction === "makeAdmin") return t("makeAdminTitle");
        if (selectedAction === "removeAdmin") return t("removeAdminTitle");
        if (selectedAction === "deactivate") return t("deactivateTitle");
        if (selectedAction === "activate") return t("activateTitle");
        return t("defaultTitle");
    }

    function getModalText() {
        if (!selectedUser) return "";
        if (selectedAction === "makeAdmin") return t("makeAdminMessage", { email: selectedUser.email });
        if (selectedAction === "removeAdmin") return t("removeAdminMessage", { email: selectedUser.email });
        if (selectedAction === "deactivate") return t("deactivateMessage", { email: selectedUser.email });
        if (selectedAction === "activate") return t("activateMessage", { email: selectedUser.email });
        return "";
    }

    return (
        <View className="flex-1">
            <View
                className="mb-4 flex-row items-center rounded-xl border px-4 py-2"
                style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                }}
            >
                <TextInput
                    value={searchText}
                    onChangeText={handleSearchChange}
                    placeholder={t("searchPlaceholder")}
                    placeholderTextColor={theme.textMuted}
                    className="flex-1 text-sm"
                    style={{ color: theme.text }}
                />
                {loading && <ActivityIndicator size="small" color={theme.textMuted} />}
            </View>

            <FlatList
                data={userList}
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
                        {loading ? t("loading") : t("noResults")}
                    </Text>
                }
            />

        <View className="mt-4 flex-row items-center justify-between border-t py-4" style={{ borderColor: theme.inputBorder }}>
            <TouchableOpacity
                disabled={!hasPreviousPage || loading}
                onPress={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                className="rounded-lg px-4 py-2 border"
                style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    opacity: hasPreviousPage ? 1 : 0.4
                }}
            >
                <Text 
                    style={{ color: hasPreviousPage ? theme.text : theme.textMuted }} 
                    className="text-sm font-medium"
                >
                    {t("previous")}
                </Text>
            </TouchableOpacity>

            <Text style={{ color: theme.text }} className="text-sm font-semibold">
                {t("pageInfo", { page: currentPage })}
            </Text>

            <TouchableOpacity
                disabled={!hasNextPage || loading}
                onPress={() => setCurrentPage((prev) => prev + 1)}
                className="rounded-lg px-4 py-2 border"
                style={{
                    backgroundColor: theme.inputBg,
                    borderColor: theme.inputBorder,
                    opacity: hasNextPage ? 1 : 0.4
                }}
            >
                <Text 
                    style={{ color: hasNextPage ? theme.text : theme.textMuted }} 
                    className="text-sm font-medium"
                >
                    {t("next")}
                </Text>
            </TouchableOpacity>
        </View>

            <AdminUserConfirmModal
                visible={!!selectedUser && !!selectedAction}
                title={getModalTitle()}
                message={getModalText()}
                error={Error}
                onCancel={closeModal}
                onConfirm={onSave}
            />
        </View>
    );
}