// /lib/theme/ThemeProvider.tsx
import { darkTheme, lightTheme } from "@/lib/theme/themes";
import { getTheme, setTheme, ThemeMode } from "@/lib/theme/themeStorage";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
    theme: typeof lightTheme;
    isDark: boolean;
    mode: ThemeMode;
    themeReady: boolean;
    changeTheme: (newMode: ThemeMode) => Promise<void>;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

type Props = {
    children: React.ReactNode;
};

export function ThemeProvider({ children }: Props) {
    const deviceTheme = useColorScheme() ?? "light";

    const [mode, setMode] = useState<ThemeMode>("device");
    const [themeReady, setThemeReady] = useState(false);

    useEffect(() => {
        async function loadTheme() {
            const savedTheme = await getTheme();
            setMode(savedTheme);
            setThemeReady(true);
        }

        loadTheme();
    }, []);

    let activeTheme = deviceTheme;

    if (mode === "light") {
        activeTheme = "light";
    }

    if (mode === "dark") {
        activeTheme = "dark";
    }

    const isDark = activeTheme === "dark";
    const theme = isDark ? darkTheme : lightTheme;

    async function changeTheme(newMode: ThemeMode) {
        setMode(newMode);
        await setTheme(newMode);
    }

    return (
        <ThemeContext.Provider
            value={{
                theme,
                isDark,
                mode,
                themeReady,
                changeTheme,
            }}
        >
            {children}
        </ThemeContext.Provider>
    );
}

export function useAppTheme() {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error("useAppTheme must be used inside ThemeProvider");
    }

    return context;
}