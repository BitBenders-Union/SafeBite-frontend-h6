// /lib/auth/rememberMe.native.ts
import * as SecureStore from "expo-secure-store";

const keepSignedInKey = "keepSignedIn";

export async function saveKeepSignedIn(value: boolean) {
    await SecureStore.setItemAsync(keepSignedInKey, value ? "true" : "false");
}

export async function getKeepSignedIn() {
    const value = await SecureStore.getItemAsync(keepSignedInKey);
    return value === "true";
}

export async function clearKeepSignedIn() {
    await SecureStore.deleteItemAsync(keepSignedInKey);
}