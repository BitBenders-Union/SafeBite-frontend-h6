import type { ScanHistoryParameters, ScanHistoryResponseDTO } from "@/lib/types/scan";
import type { ApiResponse } from "@/services/api/apiResponse";
import { Platform } from "react-native";
import { apiClient } from "./apiClient";

export type ScanHistoryPagedResponse = ApiResponse<ScanHistoryResponseDTO[]>;
export type ScanResultResponse = ScanHistoryResponseDTO;

/**
 * Sender et billede til backend for OCR og AI analyse.
 */
export async function analyzeImage(
  photo: { uri: string },
  options?: { timeoutMs?: number; }
): Promise<ScanResultResponse> {
  const formData = new FormData();
  let uri = photo.uri;

  // 1. Pak billedet til 'Image' feltet (IFormFile i C#)
  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    // VIGTIGT: Nøglen "Image" matcher din CreateScanRequest property
    formData.append("Image", blob, "scan.jpg");
  } else {
    // Android normalisering
    if (Platform.OS === "android" && uri.startsWith("file:/") && !uri.startsWith("file:///")) {
      uri = uri.replace("file:/", "file:///");
    }
    
    // Mobil upload (iOS/Android)
    formData.append("Image", {
      uri,
      name: "scan.jpg",
      type: "image/jpeg",
    } as any);
  }

  // 2. Tilføj de andre felter fra CreateScanRequest
  formData.append("Lang", "dan+eng+fra+nor+swe"); 
  formData.append("Name", "Mobile Scan " + new Date().toLocaleTimeString());

  const timeoutMs = options?.timeoutMs ?? 20000;

  // 3. POST kaldet
  const response = await apiClient.post<ScanResultResponse>(`/api/Scan`, formData,{
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data",
      },
      timeout: timeoutMs,
    }
  );

  return response.data;
}

/**
 * Henter pagineret historik
 */
export async function getMyScanHistory(
  params: ScanHistoryParameters = {}
): Promise<ScanHistoryPagedResponse> {
  const {
    currentPage = 1,
    pageSize = 5,
    query,
    orderBy,
    OrderDescending,
    ContainsAllergies,
  } = params;

  const response = await apiClient.get<ScanHistoryPagedResponse>(
    "/api/ScanHistory/paged",
    {
      params: {
        PageNumber: currentPage,
        PageSize: pageSize,
        Query: query,
        OrderBy: orderBy,
        OrderDescending: OrderDescending,
        ContainsAllergies: ContainsAllergies,
      },
    }
  );

  return response.data;
}

/**
 * Henter det samlede antal scanninger
 */
export async function getMyScanHistoryCount(): Promise<ApiResponse<number>> {
  const response = await apiClient.get<ApiResponse<number>>("/api/ScanHistory/count");
  return response.data;
}