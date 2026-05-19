// /components/app/admin/dashboard/AdminDashboardSection.tsx

import AdminQuickLinks from "@/components/app/admin/dashboard/AdminQuickLinks";
import AdminStats from "@/components/app/admin/dashboard/AdminStats";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import { getTotalUsers } from "@/services/api/adminUserManagementApi";
import { getTotalAllergies } from "@/services/api/allergyApi";
import { getTotalScans } from "@/services/api/scanApi";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Text } from "react-native";

type StatState = {
    value: number | undefined;
    isLoading: boolean;
    error: string;
};

export default function AdminDashboardSection() {
    const { theme } = useAppTheme();
    // Added translation keys for error messages and dashboard title
    const { t } = useTranslation("adminhome"); 

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
        const controller = new AbortController();
        const signal = controller.signal;

        loadUserCount(signal);
        loadAllergyCount(signal);
        loadScanCount(signal);

        return () => {
            controller.abort();
        };
    }, []);

    async function loadUserCount(signal?: AbortSignal) {
        try {
            setUsers(prev => ({
                ...prev,
                isLoading: true,
                error: "",
            }));

            const count = await getTotalUsers(signal);

            setUsers({
                value: count,
                isLoading: false,
                error: "",
            });

        } catch (error: any) {
            if (error.name !== "CanceledError" && error.name !== "AbortError") {
                setUsers({
                    value: undefined,
                    isLoading: false,
                    error: error.message || t("failedToLoadUsers"),
                });
            }
        }
    }

    async function loadAllergyCount(signal?: AbortSignal) {
        try {
            setAllergies(prev => ({
                ...prev,
                isLoading: true,
                error: "",
            }));

            const count = await getTotalAllergies(signal);

            setAllergies({
                value: count,
                isLoading: false,
                error: "",
            });

        } catch (error: any) {
            if (error.name !== "CanceledError" && error.name !== "AbortError") {
                setAllergies({
                    value: undefined,
                    isLoading: false,
                    error: error.message || t("failedToLoadAllergies"),
                });
            }
        }
    }

    async function loadScanCount(signal?: AbortSignal) {
        try {
            setScans(prev => ({
                ...prev,
                isLoading: true,
                error: "",
            }));

            const count = await getTotalScans(signal);

            setScans({
                value: count,
                isLoading: false,
                error: "",
            });

        } catch(error: any) {
            if (error.name !== "CanceledError" && error.name !== "AbortError") {
                // FIXED: Changed setUsers to setScans here
                setScans({
                    value: undefined,
                    isLoading: false,
                    error: error.message || t("failedToLoadScans"),
                });
            }
        }
    }

    return (
        <>
            <Text
                className="mb-4 text-2xl font-bold"
                style={{ color: theme.text }}
            >
                {t("title")}
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