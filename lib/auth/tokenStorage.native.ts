// /lib/auth/tokenStorage.native.ts

import { getKeepSignedIn } from "@/lib/auth/rememberMe";
import * as SecureStore from "expo-secure-store";

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
        await SecureStore.setItemAsync(accessTokenKey, accessToken);
        await SecureStore.setItemAsync(refreshTokenKey, refreshToken);

        tempAccessToken = null;
        tempRefreshToken = null;
        return;
    }

    tempAccessToken = accessToken;
    tempRefreshToken = refreshToken;

    await SecureStore.deleteItemAsync(accessTokenKey);
    await SecureStore.deleteItemAsync(refreshTokenKey);
}

export async function getAccessToken() {
    if (tempAccessToken) {
        return tempAccessToken;
    }

    return await SecureStore.getItemAsync(accessTokenKey);
}

export async function getRefreshToken() {
    if (tempRefreshToken) {
        return tempRefreshToken;
    }

    return await SecureStore.getItemAsync(refreshTokenKey);
}

export async function clearTokens() {
    tempAccessToken = null;
    tempRefreshToken = null;

    await SecureStore.deleteItemAsync(accessTokenKey);
    await SecureStore.deleteItemAsync(refreshTokenKey);
}