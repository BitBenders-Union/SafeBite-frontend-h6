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

export async function login(loginData: LoginRequest): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>("auth/login", loginData);
    return response.data;
}

export async function logout(): Promise<void> {
    await apiClient.post("/logout");
}

export async function refreshToken(refreshToken: string): Promise<RefreshResponse> {
    const response = await apiClient.post<RefreshResponse>("auth/refresh", {
        refreshToken,
    });
    return response.data;
}

export async function getUserInfo(): Promise<UserInfo> {
    const response = await apiClient.get<UserInfo>("/auth/manage/info");
    return response.data;
}

export async function forgotPassword(email: string) {
    const response = await apiClient.post("auth/forgotPassword", {
        email,
    });
    return response.data;
}

export async function resetPassword(
    resetPasswordData: ResetPasswordRequest
) {
    const response = await apiClient.post("/auth/resetPassword", resetPasswordData);
    return response.data;
}

export async function signUp(signupData: SignupRequest) {
    const response = await apiClient.post("/auth/register", signupData);
    return response.data;
} 
