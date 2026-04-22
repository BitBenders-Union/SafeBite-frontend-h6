// /lib/auth/rememberMe.web.ts
const keepSignedInKey = "keepSignedIn";

export async function saveKeepSignedIn(value: boolean) {
    localStorage.setItem(keepSignedInKey, value ? "true" : "false");
}

export async function getKeepSignedIn() {
    return localStorage.getItem(keepSignedInKey) === "true";
}

export async function clearKeepSignedIn() {
    localStorage.removeItem(keepSignedInKey);
}