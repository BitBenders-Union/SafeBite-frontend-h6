// /services/api/scanApi.ts
import type {
  ScanHistoryParameters,
  ScanHistoryResponseDTO,
} from "@/lib/types/scan";
import type { ApiResponse } from "@/services/api/apiResponse";
import { Platform } from "react-native";
import { apiClient } from "./apiClient";

export type ScanHistoryPagedResponse = {
  data: ScanHistoryResponseDTO[];
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
};

export type ScanResultResponse = ScanHistoryResponseDTO;

/**
 * Sends the image to the backend for analysis
 */
export async function analyzeImage(
  photo: { uri: string },
  options?: { timeoutMs?: number }, signal?: AbortSignal
): Promise<ScanResultResponse> {
  const formData = new FormData();
  let uri = photo.uri;

  if (Platform.OS === "web") {
    const response = await fetch(uri);
    const blob = await response.blob();
    formData.append("Image", blob, "scan.jpg");
  } else {
    if (
      Platform.OS === "android" &&
      uri.startsWith("file:/") &&
      !uri.startsWith("file:///")
    ) {
      uri = uri.replace("file:/", "file:///");
    }

    formData.append("Image", {
      uri,
      name: "scan.jpg",
      type: "image/jpeg",
    } as any);
  }

  formData.append("Lang", "dan+eng+fra+nor+swe");
  formData.append("Name", new Date().toLocaleTimeString());

  const timeoutMs = options?.timeoutMs ?? 60000;

  // 3. POST kaldet
  const response = await apiClient.post<ScanResultResponse>(
    `/api/Scan`,
    formData,
    {
      headers: {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
      },
      timeout: timeoutMs,
      signal,
    },
  );

  return response.data;
}

/**
 * Gets the users scan history
 */
export async function getMyScanHistory(
  params: ScanHistoryParameters = {},
  signal?: AbortSignal
): Promise<ScanHistoryPagedResponse> {
  const { currentPage = 1, pageSize = 6, query, ContainsAllergies } = params;

  const response = await apiClient.get<ScanHistoryPagedResponse>("/api/Scan", {
    params: {
      Page: currentPage,
      PageSize: pageSize,
      searchTerm: query,
      hasDetectedAllergies: ContainsAllergies,
    },
    signal,
  });

  return response.data;
}

/**
 * Gets the total count of scans for the user
 */
export async function getMyScanHistoryCount(signal?: AbortSignal): Promise<ApiResponse<number>> {
  const response = await apiClient.get<ApiResponse<number>>("/api/Scan/count", { signal });
  return response.data;
}

export async function getTotalScans(signal?: AbortSignal): Promise<number> {
  const response = await apiClient.get<{
    totalScanCount: number;
  }>("/api/Scan/total-count", { signal });

  return response.data.totalScanCount;
}
