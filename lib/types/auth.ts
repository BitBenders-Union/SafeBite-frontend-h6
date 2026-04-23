// /lib/types/auth.ts

export type LoginRequest = {
    email: string;
    password: string;
};

export type LoginResponse = {
    token: string;
    refreshToken: string;
    accessToken: string;
};

export type RefreshResponse = {
    tokenType: string;
    accessToken: string;
    expiresIn: number;
    refreshToken: string;
};

export type ResetPasswordRequest = {
    email: string;
    resetCode: string;
    newPassword: string;
};