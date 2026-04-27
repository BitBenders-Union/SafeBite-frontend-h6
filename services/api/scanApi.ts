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

  // Android URI normalization (file:/ -> file:///)
  if (Platform.OS === "android") {
    if (uri.startsWith("file:/") && !uri.startsWith("file:///")) {
      uri = uri.replace("file:/", "file:///");
    }

    formData.append("Image", {
      uri,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);
  }
  else if (Platform.OS === "web") {
    const blob = await fetch(uri).then((r) => r.blob());
    formData.append("Image", new File([blob], "image.jpg", { type: "image/jpeg" }));
  }
  else {
    // iOS
    formData.append("Image", {
      uri,
      name: "image.jpg",
      type: "image/jpeg",
    } as any);
  }

  formData.append("lang", "eng+dan+swe+nor+fra");
  formData.append("Name", "");

  const timeoutMs = options?.timeoutMs ?? 20000;

  const response = await apiClient.post<ScanResultResponse>(
    `/api/Scan`,
    formData,
    {
      headers: {
        Accept: "application/json",
        ...(Platform.OS === "android" ? { "Content-Type": "multipart/form-data" } : {}),
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