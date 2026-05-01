// /services/apiServices/allergyApi.ts

import { Allergy, CreateAllergyRequest, CreateAllergyResponse, UpdateAllergyRequest } from "@/lib/types/allergy";
import { PageResponse } from "@/lib/types/api";
import { apiClient } from "./apiClient";

export async function getAllergies(): Promise<Allergy[]> {
    const response = await apiClient.get<PageResponse<Allergy>>("/api/Allergy");
    return response.data.data;
}

export async function getmyAllergies(): Promise<Allergy[]> {
    const response = await apiClient.get<PageResponse<Allergy>>("/api/AllergyUser");
    return response.data.data;
}

export async function getmycustomAllergies(): Promise<Allergy[]> {
    const response = await apiClient.get<PageResponse<Allergy>>("/api/CustomAllergy");
    return response.data.data;
}

export async function addCustomAllergy(name: string): Promise<Allergy> {
    const response = await apiClient.post<Allergy>("/api/CustomAllergy", { name });
    return response.data;
}

export async function deleteCustomAllergy(customAllergyId: string): Promise<void> {
    await apiClient.delete(`/api/CustomAllergy/${customAllergyId}`);
}

export async function deleteUserAllergy(allergyId: string): Promise<void> {
    await apiClient.delete(`/api/AllergyUser/${allergyId}`);
}

export async function createAllergy(
    allergyData: CreateAllergyRequest
): Promise<CreateAllergyResponse> {
    const response = await apiClient.post<CreateAllergyResponse>(
        "/api/Allergy?Page=1&PageSize=50",
        allergyData
    );
    return response.data;
}

export async function updateAllergy(
    updatedAllergyData: UpdateAllergyRequest
): Promise<void> {
    await apiClient.put("/api/Allergy", updatedAllergyData);
}
