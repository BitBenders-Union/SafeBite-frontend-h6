import AdminUserConfirmModal from "@/components/app/admin/users/AdminUserConfirmModal";
import AdminUserRow from "@/components/app/admin/users/AdminUserRow";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { UserList, UserRole } from "@/lib/types/user";
import { activateUser, deactivateUser, getAllUsersAndRoles, removeRole, setRole } from "@/services/api/adminUserManagementApi";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";


type PendingAction = "makeAdmin" | "removeAdmin" | "deactivate" | "activate";

export default function AdminUserSection() {
    const { theme } = useAppTheme();

    const [userList, setUserList] = useState<UserList[]>([]);``
    const [searchText, setSearchText] = useState("");
    const [actionError, setActionError] = useState("");
    const [fetchError, setLoadError] = useState("");
    const [loading, setIsLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
    const [pendingAction, setPendingAction] = useState<PendingAction | null>(null);


    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setLoadError("");
            setIsLoading(true);
            
            const data = await getAllUsersAndRoles();
            setUserList(data);
        }

        catch (err: any) {
            setLoadError(err.message || "Failed to load users.");
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

    function openAction(user: UserList, action: PendingAction) {
        setActionError("");
        setSelectedUser(user);
        setPendingAction(action);
    }

    function closeActionModal() {
        setSelectedUser(null);
        setPendingAction(null);
        setActionError("");
    }

    async function confirmAction() {
        if (!selectedUser || !pendingAction) return;
        
        const userrole: UserRole = {
            userID: selectedUser.id,
            roleName: "Admin"
        }

        if (pendingAction === "makeAdmin") {
            const alreadyAdmin = selectedUser.roles.some((r) => r.roleName === "Admin");

            if (alreadyAdmin) {
                setActionError("User already has admin role.");
                return;
            }

            try {
                await setRole(userrole);
                await loadUsers();
            }
             catch (err) {
                setActionError("Failed to assign admin role.");
            }
        };

        if (pendingAction === "removeAdmin") {

            try {
                await removeRole(userrole);
                await loadUsers();
            }
             catch (err) {
                setActionError("Failed to remove admin role.");
            }
        }

        if (pendingAction === "deactivate") {
            if (selectedUser.isActive === false) {
                setActionError("User is already inactive.");
                return;
            }

            try
            {
                await deactivateUser(selectedUser.id);
                await loadUsers();
            }

            catch (err) {
                setActionError("Failed to deactivate user.");
            }
        }

        if (pendingAction === "activate") {
            try
            {
                await activateUser(selectedUser.id);
                await loadUsers();
            }

            catch (err) {
                setActionError("Failed to activate user.");
            }
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
                keyExtractor={(user) => user.id}
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