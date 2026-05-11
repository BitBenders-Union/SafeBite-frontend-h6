// /lib/theme/themeStorage.ts
import AsyncStorage from "@react-native-async-storage/async-storage";

export type ThemeMode = "device" | "light" | "dark";

const storageKey = "appTheme";

export async function setTheme(mode: ThemeMode) {
    await AsyncStorage.setItem(storageKey, mode);
}

export async function getTheme(): Promise<ThemeMode> {
    const saved = await AsyncStorage.getItem(storageKey);

    if (saved === "light" || saved === "dark" || saved === "device") {
        return saved;
    }

    return "device";
}