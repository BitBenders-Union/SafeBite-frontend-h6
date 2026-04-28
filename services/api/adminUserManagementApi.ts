import { UserList, UserRole } from "@/lib/types/user";
import { PageResponse } from "@/lib/types/api";
import { apiClient } from "./apiClient";


export async function getAllUsersAndRoles(): Promise<UserList[]> {
    const response = await apiClient.get<PageResponse<UserList>>("/api/User/UserManagement/GetAllUsersWithRoles");
    return response.data.data;
}

export async function setRole(userRole: UserRole){
    const response = await apiClient.post("/api/User/UserManagement/SetRole", userRole);
    return response;
}

export async function removeRole(userRole: UserRole){
    const response = await apiClient.post("/api/User/UserManagement/RemoveRole", userRole);
    return response;
}

export async function activateUser(userID:string) {
    const response = await apiClient.post(`/api/User/UserManagement/${userID}/Activate`)
    return response;
}

export async function deactivateUser(userID:string) {
    const response = await apiClient.post(`/api/User/UserManagement/${userID}/Deactivate`)
    return response;
}

