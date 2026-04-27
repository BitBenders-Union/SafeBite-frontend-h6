// /components/app/admin/dashboard/AdminDashboardSection.tsx
import AdminQuickLinks from "@/components/app/admin/dashboard/AdminQuickLinks";
import AdminStats from "@/components/app/admin/dashboard/AdminStats";
import { useAppTheme } from "@/lib/theme/useAppTheme";
import React, { useEffect, useState } from "react";
import { Text } from "react-native";

type AdminStatsData = {
    users: number;
    allergies: number;
    scans: number;
};

export default function AdminDashboardSection() {
    const { theme } = useAppTheme();

    const [stats, setStats] = useState<AdminStatsData>({
        users: 0,
        allergies: 0,
        scans: 0,
    });

    useEffect(() => {
        // MOCK MOCK MOCK !
        setStats({
            users: 76,
            allergies: 34,
            scans: 120,
        });
    }, []);

    return (
        <>
            <Text
                className="mb-4 text-2xl font-bold"
                style={{ color: theme.text }}
            >
                Admin Dashboard
            </Text>

            <AdminStats
                users={stats.users}
                allergies={stats.allergies}
                scans={stats.scans}
            />

            <AdminQuickLinks />
        </>
    );
}