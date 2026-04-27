import AdminDashboardSection from "@/components/app/admin/dashboard/AdminDashboardSection";
import React from "react";
import { View } from "react-native";

export default function AdminHome() {
    return (
        <View className="flex-1 px-6 pt-12 items-center">
            <View className="w-full max-w-[1100px]">
                <AdminDashboardSection />
            </View>
        </View>
    );
}