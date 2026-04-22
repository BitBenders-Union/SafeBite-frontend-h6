// /lib/theme/themes.ts

export type GradientConfig = {
    colors: readonly [string, string, ...string[]];
    start: { x: number; y: number };
    end: { x: number; y: number };
};

export type ShadowStyle = {
    color: string;
    opacity: number;
    radius: number;
    offset: {
        width: number;
        height: number;
    };
};

export type AppTheme = {
    background: string;
    card: string;
    surface: string;
    surfaceSoft: string;
    surfaceStrong: string;

    text: string;
    inverseText: string;
    textMuted: string;
    textPlaceholder: string;
    labelText: string;

    successText: string;
    successBg: string;
    successBorder: string;

    warningText: string;
    warningBg: string;
    warningBorder: string;

    border: string;
    borderSoft: string;
    borderStrong: string;

    divider: string;

    inputBg: string;
    inputBorder: string;

    buttonPrimaryBg: string;
    buttonPrimaryText: string;

    buttonGhostBg: string;
    buttonGhostBorder: string;
    buttonGhostText: string;

    dangerText: string;
    dangerBorder: string;
    dangerBg: string;
    dangerSolid: string;
    dangerSolidText: string;

    linkText: string;
    linkTextDisabled: string;

    active: string;
    activeSoft: string;

    gradient: GradientConfig;

    shadowCard: ShadowStyle;

    scanButtonBg: string;
    scanButtonDisabledBg: string;
    scanButtonDangerBg: string;
    scanButtonBorder: string;

    hourglassFrame: string;
    hourglassGlass: string;
    hourglassSand: string;

    iconPrimary: string;


};

export const lightTheme: AppTheme = {
    background: "#F6F7FB",
    card: "#FAFAFA",
    surface: "#FFFFFF",
    surfaceSoft: "rgba(255,255,255,0.60)",
    surfaceStrong: "rgba(255,255,255,0.80)",

    text: "#111827",
    inverseText: "#FFFFFF",
    textMuted: "rgba(0,0,0,0.60)",
    textPlaceholder: "#6B7280",
    labelText: "#6B7280",

    successText: "#16A34A",
    successBg: "rgba(22,163,74,0.10)",
    successBorder: "rgba(22,163,74,0.30)",

    warningText: "#EA580C",
    warningBg: "rgba(234,88,12,0.10)",
    warningBorder: "rgba(234,88,12,0.30)",

    border: "#E5E7EB",
    borderSoft: "rgba(0,0,0,0.05)",
    borderStrong: "rgba(0,0,0,0.20)",

    divider: "#E5E7EB",

    inputBg: "rgba(255,255,255,0.80)",
    inputBorder: "rgba(0,0,0,0.20)",

    buttonPrimaryBg: "#111827",
    buttonPrimaryText: "#FFFFFF",

    buttonGhostBg: "transparent",
    buttonGhostBorder: "rgba(0,0,0,0.20)",
    buttonGhostText: "#111827",

    dangerText: "rgba(220,38,38,1)",
    dangerBorder: "rgba(239,68,68,0.40)",
    dangerBg: "rgba(255,255,255,0.70)",
    dangerSolid: "rgba(220,38,38,1)",
    dangerSolidText: "#FFFFFF",

    linkText: "#2563EB",
    linkTextDisabled: "#9CA3AF",

    active: "#38A3A5",
    activeSoft: "rgba(56,163,165,0.12)",

    gradient: {
        colors: ["#B2F2BB", "#74C69D", "#38A3A5"],
        start: { x: 0, y: 0 },
        end: { x: 1, y: 1 },
    },

    shadowCard: {
        color: "#000",
        opacity: 0.10,
        radius: 18,
        offset: { width: 0, height: 10 },
    },

    scanButtonBg: "#FFFFFF",
    scanButtonDisabledBg: "#FAFAFA",
    scanButtonDangerBg: "#FEE2E2",
    scanButtonBorder: "#E5E7EB",

    hourglassFrame: "rgba(17,24,39,0.55)",
    hourglassGlass: "rgba(17,24,39,0.14)",
    hourglassSand: "#FF3D00",

    iconPrimary: "#065f46"
};

export const darkTheme: AppTheme = {
    background: "#0F172A",
    card: "rgba(31, 41, 55, 0.75)",
    surface: "rgba(17,24,39,0.75)",
    surfaceSoft: "rgba(17,24,39,0.45)",
    surfaceStrong: "#111827",

    text: "#F9FAFB",
    inverseText: "#111827",
    textMuted: "rgba(249,250,251,0.65)",
    textPlaceholder: "#9CA3AF",
    labelText: "rgba(249,250,251,0.55)",

    successText: "#4ADE80",
    successBg: "rgba(74,222,128,0.12)",
    successBorder: "rgba(74,222,128,0.30)",

    warningText: "#FB923C",
    warningBg: "rgba(251,146,60,0.12)",
    warningBorder: "rgba(251,146,60,0.30)",

    border: "rgba(229, 231, 235,0.3)",
    borderSoft: "rgba(255,255,255,0.08)",
    borderStrong: "rgba(255,255,255,0.14)",

    divider: "rgba(255,255,255,0.14)",

    inputBg: "#111827",
    inputBorder: "#374151",

    buttonPrimaryBg: "#F9FAFB",
    buttonPrimaryText: "#111827",

    buttonGhostBg: "rgba(17,24,39,0.55)",
    buttonGhostBorder: "rgba(255,255,255,0.14)",
    buttonGhostText: "#F9FAFB",

    dangerText: "rgba(248,113,113,1)",
    dangerBorder: "rgba(239,68,68,0.9)",
    dangerBg: "rgba(17,24,39,0.75)",
    dangerSolid: "rgba(220,38,38,1)",
    dangerSolidText: "#FFFFFF",

    linkText: "#60A5FA",
    linkTextDisabled: "#6B7280",

    active: "#74C69D",
    activeSoft: "rgba(116,198,157,0.16)",

    gradient: {
        colors: ["#0F2027", "#203A43", "#2C5364"],
        start: { x: 0, y: 1 },
        end: { x: 0, y: 0 },
    },

    shadowCard: {
        color: "#000",
        opacity: 0.4,
        radius: 18,
        offset: { width: 0, height: 10 },
    },

    scanButtonBg: "#111827",
    scanButtonDisabledBg: "#1F2937",
    scanButtonDangerBg: "#3F1D1D",
    scanButtonBorder: "rgba(255,255,255,0.14)",

    hourglassFrame: "#FFFFFF",
    hourglassGlass: "rgba(255,255,255,0.40)",
    hourglassSand: "#FF3D00",

    iconPrimary: "#34d399"
};