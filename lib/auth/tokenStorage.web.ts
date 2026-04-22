// /lib/auth/tokenStorage.web.ts

import { getKeepSignedIn } from "@/lib/auth/rememberMe";

const accessTokenKey = "accessToken";
const refreshTokenKey = "refreshToken";

let tempAccessToken: string | null = null;
let tempRefreshToken: string | null = null;

export async function saveTokens(
    accessToken: string,
    refreshToken: string
) {
    const keepSignedIn = await getKeepSignedIn();

    if (keepSignedIn) {
        localStorage.setItem(accessTokenKey, accessToken);
        localStorage.setItem(refreshTokenKey, refreshToken);

        tempAccessToken = null;
        tempRefreshToken = null;
        return;
    }

    tempAccessToken = accessToken;
    tempRefreshToken = refreshToken;

    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
}

export async function getAccessToken() {
    if (tempAccessToken) {
        return tempAccessToken;
    }

    return localStorage.getItem(accessTokenKey);
}

export async function getRefreshToken() {
    if (tempRefreshToken) {
        return tempRefreshToken;
    }

    return localStorage.getItem(refreshTokenKey);
}

export async function clearTokens() {
    tempAccessToken = null;
    tempRefreshToken = null;

    localStorage.removeItem(accessTokenKey);
    localStorage.removeItem(refreshTokenKey);
}