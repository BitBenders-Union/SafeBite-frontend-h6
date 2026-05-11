// /services/apiServices/authApi.ts
import {
    LoginRequest,
    LoginResponse,
    RefreshResponse,
    ResetPasswordRequest,
    SignupRequest,
} from "@/lib/types/auth";
import { UserInfo } from "@/lib/types/user";
import { apiClient } from "./apiClient";

export async function login(loginData: LoginRequest, signal?: AbortSignal): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("auth/login", loginData, { signal });
    return response.data;
}

export async function logout(signal?: AbortSignal): Promise<void> {
    await apiClient.post("/logout", { signal });
}

export async function refreshToken(refreshToken: string, signal?: AbortSignal): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>("auth/refresh", {
        refreshToken,
    }, { signal });
    return response.data;
}

export async function getUserInfo(signal?: AbortSignal): Promise<UserInfo> {
    const response = await apiClient.get<UserInfo>("/auth/manage/info", { signal });
    return response.data;
}

export async function forgotPassword(email: string, signal?: AbortSignal) {
    const response = await apiClient.post("auth/forgotPassword", {
        email,
    }, { signal });
    return response.data;
}

export async function resetPassword(
    resetPasswordData: ResetPasswordRequest,
    signal?: AbortSignal
) {
    const response = await apiClient.post("/auth/resetPassword", resetPasswordData, { signal });
    return response.data;
}

export async function signUp(signupData: SignupRequest, signal?: AbortSignal) {
    const response = await apiClient.post("/auth/register", signupData, { signal });
    return response.data;
} 
