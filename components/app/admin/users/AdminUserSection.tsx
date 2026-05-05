import AdminUserConfirmModal from "@/components/app/admin/users/AdminUserConfirmModal";
import AdminUserRow from "@/components/app/admin/users/AdminUserRow";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { UserList, UserRole } from "@/lib/types/user";
import { activateUser, deactivateUser, getAllUsersAndRoles, removeRole, setRole } from "@/services/api/adminUserManagementApi";
import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Text, TextInput, View } from "react-native";


type ActionType = "makeAdmin" | "removeAdmin" | "deactivate" | "activate";

export default function AdminUserSection() {
    const { theme } = useAppTheme();

    const [userList, setUserList] = useState<UserList[]>([]); ``
    const [searchText, setSearchText] = useState("");
    const [Error, setError] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setIsLoading] = useState(true);

    const [selectedUser, setSelectedUser] = useState<UserList | null>(null);
    const [selectedAction, setSelectedAction] = useState<ActionType | null>(null);


    useEffect(() => {
        loadUsers();
    }, []);

    async function loadUsers() {
        try {
            setErrorMessage("");
            setIsLoading(true);

            const data = await getAllUsersAndRoles();
            setUserList(data);
        }

        catch (err: any) {
            setErrorMessage(err.message || "Failed to load users.");
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
        }

        if (selectedAction === "makeAdmin") {
            const alreadyAdmin = selectedUser.roles.some((r) => r.roleName === "Admin");

            if (alreadyAdmin) {
                setError("User already has admin role.");
                return;
            }

            try {
                await setRole(userrole);
                await loadUsers();
            }
            catch (err) {
                setError("Failed to assign admin role.");
            }
        };

        if (selectedAction === "removeAdmin") {

            try {
                await removeRole(userrole);
                await loadUsers();
            }
            catch (err) {
                setError("Failed to remove admin role.");
            }
        }

        if (selectedAction === "deactivate") {
            if (selectedUser.isActive === false) {
                setError("User is already inactive.");
                return;
            }

            try {
                await deactivateUser(selectedUser.id);
                await loadUsers();
            }

            catch (err) {
                setError("Failed to deactivate user.");
            }
        }

        if (selectedAction === "activate") {
            try {
                await activateUser(selectedUser.id);
                await loadUsers();
            }

            catch (err) {
                setError("Failed to activate user.");
            }
        }

        closeModal();
    }

    function getModalTitle() {
        if (selectedAction === "makeAdmin") return "Give admin role";
        if (selectedAction === "removeAdmin") return "Remove admin role";
        if (selectedAction === "deactivate") return "Deactivate user";
        if (selectedAction === "activate") return "Activate user";
        return "Confirm action";
    }

    function getModalText() {
        if (!selectedUser) return "";

        if (selectedAction === "makeAdmin") {
            return `Give admin role to ${selectedUser.email}?`;
        }

        if (selectedAction === "removeAdmin") {
            return `Remove admin role from ${selectedUser.email}?`;
        }

        if (selectedAction === "deactivate") {
            return `Deactivate ${selectedUser.email}?`;
        }

        if (selectedAction === "activate") {
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
                            showModal(pickedUser, "makeAdmin")
                        }
                        onRemoveAdmin={(pickedUser) =>
                            showModal(pickedUser, "removeAdmin")
                        }
                        onDeactivate={(pickedUser) =>
                            showModal(pickedUser, "deactivate")
                        }
                        onActivate={(pickedUser) =>
                            showModal(pickedUser, "activate")
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