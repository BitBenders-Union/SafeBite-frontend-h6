// /services/apiServices/allergyApi.ts

import {
    Allergy,
    AllergyUser,
    CreateAllergyRequest,
    CreateAllergyResponse,
    UpdateAllergyRequest,
} from "@/lib/types/allergy";
import { PageResponse } from "@/lib/types/api";
import { apiClient } from "./apiClient";

export async function getAllergies(signal?: AbortSignal): Promise<Allergy[]> {
    const response = await apiClient.get<PageResponse<Allergy>>("/api/Allergy", { signal });
    return response.data.data;
}

export async function getmyAllergies(signal?: AbortSignal): Promise<Allergy[]> {
    const response =
        await apiClient.get<PageResponse<Allergy>>("/api/AllergyUser", { signal });
    return response.data.data;
}

export async function getMyCustomAllergies(signal?: AbortSignal): Promise<Allergy[]> {
    const response =
        await apiClient.get<PageResponse<Allergy>>("/api/CustomAllergy", { signal });
    return response.data.data;
}

export async function addCustomAllergy(name: string, signal?: AbortSignal): Promise<Allergy> {
    const response = await apiClient.post<Allergy>("/api/CustomAllergy", {
        name,
    }, { signal });
    return response.data;
}

export async function deleteCustomAllergy(
    customAllergyId: string,
    signal?: AbortSignal
): Promise<void> {
    await apiClient.delete(`/api/CustomAllergy/${customAllergyId}`, { signal });
}

export async function deleteUserAllergy(allergyId: string, signal?: AbortSignal): Promise<void> {
    await apiClient.delete(`/api/AllergyUser/${allergyId}`, { signal });
}

export async function createAllergy(
    allergyData: CreateAllergyRequest,
    signal?: AbortSignal
): Promise<CreateAllergyResponse> {
    const response = await apiClient.post<CreateAllergyResponse>(
        "/api/Allergy?Page=1&PageSize=50",
        allergyData,
        { signal }
    );
    return response.data;
}

export async function updateAllergy(
    updatedAllergyData: UpdateAllergyRequest,
    signal?: AbortSignal
): Promise<void> {
    await apiClient.put("/api/Allergy", updatedAllergyData, { signal });
}

export async function getMyAllergyRelations(signal?: AbortSignal): Promise<AllergyUser[]> {
    const response =
        await apiClient.get<PageResponse<AllergyUser>>("/api/AllergyUser", { signal });
    return response.data.data;
}

export async function removeUserAllergy(allergyId: string, signal?: AbortSignal): Promise<void> {
    await apiClient.delete(`/api/AllergyUser/${allergyId}`, { signal });
}

export async function addUserAllergy(allergyId: string, signal?: AbortSignal): Promise<void> {
    await apiClient.post("/api/AllergyUser", { allergyId }, { signal });
}

export async function getTotalAllergies(signal?: AbortSignal): Promise<number> {
    const response = await apiClient.get<{
        totalAllergyCount: number;
    }>("/api/Allergy/total-count", { signal });

    return response.data.totalAllergyCount;
}
