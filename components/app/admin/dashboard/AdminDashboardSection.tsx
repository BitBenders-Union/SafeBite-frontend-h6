// /components/app/admin/dashboard/AdminDashboardSection.tsx

import AdminQuickLinks from "@/components/app/admin/dashboard/AdminQuickLinks";
import AdminStats from "@/components/app/admin/dashboard/AdminStats";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { getTotalUsers } from "@/services/api/adminUserManagementApi";
import { getTotalAllergies } from "@/services/api/allergyApi";
import { getTotalScans } from "@/services/api/scanApi";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

type StatState = {
    value: number | undefined;
    isLoading: boolean;
    error: string;
};

export default function AdminDashboardSection() {
    const { theme } = useAppTheme();

    const [users, setUsers] = useState<StatState>({
        value: undefined,
        isLoading: true,
        error: "",
    });

    const [allergies, setAllergies] = useState<StatState>({
        value: undefined,
        isLoading: true,
        error: "",
    });

    const [scans, setScans] = useState<StatState>({
        value: undefined,
        isLoading: true,
        error: "",
    });

    useEffect(() => {
        loadUserCount();
        loadAllergyCount();
        loadScanCount();
    }, []);

    async function loadUserCount() {
        try {
            setUsers(prev => ({
                ...prev,
                isLoading: true,
                error: "",
            }));

            const count = await getTotalUsers();

            setUsers({
                value: count,
                isLoading: false,
                error: "",
            });

        } catch (error) {
            setUsers({
                value: undefined,
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load user count.",
            });
        }
    }

    async function loadAllergyCount() {
        try {
            setAllergies(prev => ({
                ...prev,
                isLoading: true,
                error: "",
            }));

            const count = await getTotalAllergies();

            setAllergies({
                value: count,
                isLoading: false,
                error: "",
            });

        } catch (error) {
            setAllergies({
                value: undefined,
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load allergy count.",
            });
        }
    }

    async function loadScanCount() {
        try {
            setScans(prev => ({
                ...prev,
                isLoading: true,
                error: "",
            }));

            const count = await getTotalScans();

            setScans({
                value: count,
                isLoading: false,
                error: "",
            });

        } catch (error) {
            setScans({
                value: undefined,
                isLoading: false,
                error:
                    error instanceof Error
                        ? error.message
                        : "Failed to load scan count.",
            });
        }
    }

    return (
        <>
            <Text
                className="mb-4 text-2xl font-bold"
                style={{ color: theme.text }}
            >
                Admin Dashboard
            </Text>

            <AdminStats
                users={users}
                allergies={allergies}
                scans={scans}
            />

            <AdminQuickLinks />
        </>
    );
}