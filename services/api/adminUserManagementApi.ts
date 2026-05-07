import { PageResponse } from "@/lib/types/api";
import { UserList, UserRole } from "@/lib/types/user";
import { apiClient } from "./apiClient";


export async function getAllUsersAndRoles(signal?: AbortSignal): Promise<UserList[]> {
    const response = await apiClient.get<PageResponse<UserList>>("/api/User/UserManagement/GetAllUsersWithRoles", { signal });
    return response.data.data;
}

export async function setRole(userRole: UserRole, signal?: AbortSignal) {
    const response = await apiClient.post("/api/User/UserManagement/SetRole", userRole, { signal });
    return response;
}

export async function removeRole(userRole: UserRole, signal?: AbortSignal){
    const response = await apiClient.post("/api/User/UserManagement/RemoveRole", userRole, { signal });
    return response;
}

export async function activateUser(userID:string, signal?: AbortSignal) {
    const response = await apiClient.post(`/api/User/UserManagement/${userID}/Activate`, undefined, { signal });
    return response;
}

export async function deactivateUser(userID:string, signal?: AbortSignal) {
    const response = await apiClient.post(`/api/User/UserManagement/${userID}/Deactivate`, undefined, { signal });
    return response;
}

