// /components/app/admin/allergies/AdminAllergySection.tsx
import AdminAllergyCreateForm from "@/components/app/admin/allergies/AdminAllergyCreateForm";
import AdminAllergyEditModal from "@/components/app/admin/allergies/AdminAllergyEditModal";
import AdminAllergyRow from "@/components/app/admin/allergies/AdminAllergyRow";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { Allergy } from "@/lib/types/allergy";
import {
    createAllergy,
    getAllergies,
    updateAllergy,
} from "@/services/api/allergyApi";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function AdminAllergySection() {
    const { theme } = useAppTheme();

    const [allergyList, setAllergyList] = useState<Allergy[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState("");

    const [newName, setNewName] = useState("");
    const [newIcon, setNewIcon] = useState("");
    const [isCreating, setIsCreating] = useState(false);
    const [createError, setCreateError] = useState("");

    const [selectedAllergy, setSelectedAllergy] = useState<Allergy | null>(null);
    const [editName, setEditName] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [editError, setEditError] = useState("");

    useEffect(() => {
        loadAllergies();
    }, []);

    async function loadAllergies() {
        try {
            setLoadError("");
            setIsLoading(true);

            const data = await getAllergies();
            setAllergyList(data);
        } catch (error) {
            setLoadError(
                error instanceof Error
                    ? error.message
                    : "Failed to load allergies."
            );
        } finally {
            setIsLoading(false);
        }
    }

    async function handleCreate() {
        const trimmedName = newName.trim();

        if (!trimmedName) {
            setCreateError("Name is required.");
            return;
        }

        try {
            setCreateError("");
            setIsCreating(true);

            const created = await createAllergy({
                name: trimmedName,
            });

            setAllergyList((prev) => [...prev, created]);
            setNewName("");
            setNewIcon("");
        } catch (error) {
            setCreateError(
                error instanceof Error
                    ? error.message
                    : "Failed to create allergy."
            );
        } finally {
            setIsCreating(false);
        }
    }

    function openEdit(allergy: Allergy) {
        setEditError("");
        setSelectedAllergy(allergy);
        setEditName(allergy.name);
    }

    function closeEditModal() {
        if (isSaving) return;

        setSelectedAllergy(null);
        setEditName("");
        setEditError("");
    }

    async function handleSaveEdit() {
        if (!selectedAllergy) return;

        const trimmedName = editName.trim();

        if (!trimmedName) {
            setEditError("Name is required.");
            return;
        }

        try {
            setEditError("");
            setIsSaving(true);

            await updateAllergy({
                id: selectedAllergy.id,
                name: trimmedName,
            });

            setAllergyList((prev) =>
                prev.map((item) =>
                    item.id === selectedAllergy.id
                        ? { ...item, name: trimmedName }
                        : item
                )
            );

            closeEditModal();
        } catch (error) {
            setEditError(
                error instanceof Error
                    ? error.message
                    : "Failed to update allergy."
            );
        } finally {
            setIsSaving(false);
        }
    }

    function handleDelete(allergy: Allergy) {
        console.log("delete allergy", allergy);
    }

    return (
        <>
            <View className="flex-1">
                <AdminAllergyCreateForm
                    newName={newName}
                    onChangeName={setNewName}
                    newIcon={newIcon}
                    onChangeIcon={setNewIcon}
                    onCreate={handleCreate}
                    isCreating={isCreating}
                    createError={createError}
                />

                {isLoading ? (
                    <View className="items-center justify-center py-10">
                        <ActivityIndicator
                            size="large"
                            color={theme.active}
                        />
                        <Text
                            className="mt-3"
                            style={{ color: theme.textMuted }}
                        >
                            Loading allergies...
                        </Text>
                    </View>
                ) : loadError ? (
                    <View className="py-6">
                        <Text
                            className="text-base font-semibold"
                            style={{ color: theme.dangerText }}
                        >
                            Something went wrong
                        </Text>

                        <Text
                            className="mt-2"
                            style={{ color: theme.textMuted }}
                        >
                            {loadError}
                        </Text>

                        <TouchableOpacity
                            onPress={loadAllergies}
                            className="mt-4 self-start rounded-xl px-4 py-2"
                            style={{
                                backgroundColor: theme.activeSoft,
                            }}
                        >
                            <Text style={{ color: theme.active }}>
                                Try again
                            </Text>
                        </TouchableOpacity>
                    </View>
                ) : (
                    <FlatList
                        data={allergyList}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <AdminAllergyRow
                                item={item}
                                onEdit={openEdit}
                                onDelete={handleDelete}
                            />
                        )}
                        style={{ flex: 1 }}
                        contentContainerStyle={{ paddingBottom: 16 }}
                        showsVerticalScrollIndicator={false}
                        ListEmptyComponent={
                            <View className="py-6">
                                <Text
                                    className="text-base font-semibold"
                                    style={{ color: theme.text }}
                                >
                                    No allergies found
                                </Text>

                                <Text
                                    className="mt-2"
                                    style={{ color: theme.textMuted }}
                                >
                                    There are currently no allergies in the system.
                                </Text>
                            </View>
                        }
                    />
                )}
            </View>

            <AdminAllergyEditModal
                visible={!!selectedAllergy}
                item={selectedAllergy}
                editName={editName}
                onChangeName={setEditName}
                onClose={closeEditModal}
                onSave={handleSaveEdit}
                isSaving={isSaving}
                error={editError}
            />
        </>
    );
}