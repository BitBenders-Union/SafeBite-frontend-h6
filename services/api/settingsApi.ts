// /services/apiServices/settingsApi.ts

import { apiClient } from "./apiClient";

export async function deactivateUser(signal?: AbortSignal): Promise<void> {
    await apiClient.patch("/auth/manage/deactivateUser", undefined, { signal });
}