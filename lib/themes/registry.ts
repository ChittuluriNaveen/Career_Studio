export interface ThemeConfig {
  id: string;
  name: string;
  mode: "dark" | "light";
  primaryColor: string;
  secondaryColor: string;
  bgColor: string;
  cardBg: string;
  cardBorder: string;
  textColor: string;
  subtextColor: string;
  inputBg: string;
  inputBorder: string;
  heroBg: string;
  fontFamily: string;
  description: string;
  badgeStyle: string;
}

export const THEME_REGISTRY: Record<string, ThemeConfig> = {
  "cyber-dark": {
    id: "cyber-dark",
    name: "Cyber AI Dark Portal",
    mode: "dark",
    primaryColor: "#06b6d4",
    secondaryColor: "#3b82f6",
    bgColor: "#030712",
    cardBg: "rgba(15, 23, 42, 0.85)",
    cardBorder: "rgba(56, 189, 248, 0.3)",
    textColor: "#f8fafc",
    subtextColor: "#94a3b8",
    inputBg: "rgba(2, 6, 23, 0.75)",
    inputBorder: "rgba(56, 189, 248, 0.35)",
    heroBg: "radial-gradient(ellipse at top, #0e7490 0%, #030712 75%)",
    fontFamily: "Inter",
    description: "Futuristic dark neon mode with cyan glow and glassmorphism cards",
    badgeStyle: "bg-cyan-950/80 text-cyan-400 border-cyan-800/80",
  },
  "midnight-purple": {
    id: "midnight-purple",
    name: "Midnight Galaxy Glass",
    mode: "dark",
    primaryColor: "#a855f7",
    secondaryColor: "#ec4899",
    bgColor: "#090514",
    cardBg: "rgba(24, 15, 46, 0.85)",
    cardBorder: "rgba(168, 85, 247, 0.35)",
    textColor: "#faf5ff",
    subtextColor: "#c084fc",
    inputBg: "rgba(15, 7, 32, 0.75)",
    inputBorder: "rgba(168, 85, 247, 0.35)",
    heroBg: "radial-gradient(ellipse at top, #581c87 0%, #090514 75%)",
    fontFamily: "Outfit",
    description: "Deep violet night aesthetic with vibrant purple gradients & glow",
    badgeStyle: "bg-purple-950/80 text-purple-300 border-purple-800/80",
  },
  "emerald-biotech": {
    id: "emerald-biotech",
    name: "Emerald Bio & Eco Tech",
    mode: "dark",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    bgColor: "#022c22",
    cardBg: "rgba(6, 78, 59, 0.85)",
    cardBorder: "rgba(16, 185, 129, 0.4)",
    textColor: "#ecfdf5",
    subtextColor: "#6ee7b7",
    inputBg: "rgba(2, 44, 34, 0.75)",
    inputBorder: "rgba(16, 185, 129, 0.35)",
    heroBg: "radial-gradient(ellipse at top, #047857 0%, #022c22 75%)",
    fontFamily: "Outfit",
    description: "Forest dark environment with mint green bio-tech highlights",
    badgeStyle: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
  },
  "corporate-clean": {
    id: "corporate-clean",
    name: "Enterprise Modern Light",
    mode: "light",
    primaryColor: "#0f766e",
    secondaryColor: "#0369a1",
    bgColor: "#f8fafc",
    cardBg: "#ffffff",
    cardBorder: "#e2e8f0",
    textColor: "#0f172a",
    subtextColor: "#475569",
    inputBg: "#ffffff",
    inputBorder: "#cbd5e1",
    heroBg: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
    fontFamily: "Inter",
    description: "Crisp, professional SaaS layout with indigo & teal accents",
    badgeStyle: "bg-teal-50 text-teal-800 border-teal-200",
  },
  "minimal-luxury": {
    id: "minimal-luxury",
    name: "Minimalist Editorial Luxury",
    mode: "light",
    primaryColor: "#b45309",
    secondaryColor: "#1c1917",
    bgColor: "#fbf9f5",
    cardBg: "#ffffff",
    cardBorder: "#e7e5e4",
    textColor: "#1c1917",
    subtextColor: "#57534e",
    inputBg: "#ffffff",
    inputBorder: "#d6d3d1",
    heroBg: "linear-gradient(180deg, #f5f0e6 0%, #fbf9f5 100%)",
    fontFamily: "Geist",
    description: "Warm parchment luxury cream with gold amber accents",
    badgeStyle: "bg-amber-50 text-amber-900 border-amber-200",
  },
  "vibrant-creative": {
    id: "vibrant-creative",
    name: "Vibrant Neon Creative",
    mode: "light",
    primaryColor: "#7c3aed",
    secondaryColor: "#f43f5e",
    bgColor: "#faf5ff",
    cardBg: "#ffffff",
    cardBorder: "#e9d5ff",
    textColor: "#1e1b4b",
    subtextColor: "#6b21a8",
    inputBg: "#ffffff",
    inputBorder: "#ddd6fe",
    heroBg: "linear-gradient(135deg, #f3e8ff 0%, #ffe4e6 100%)",
    fontFamily: "Poppins",
    description: "High-energy startup look with violet-rose gradients",
    badgeStyle: "bg-purple-100 text-purple-900 border-purple-300",
  },
};

// Utility to parse hex string into RGB numbers
export function parseHexColor(hex: string): { r: number; g: number; b: number } | null {
  if (!hex || typeof hex !== "string") return null;
  const cleanHex = hex.trim().replace(/^#/, "");
  if (cleanHex.length === 3) {
    const r = parseInt(cleanHex[0] + cleanHex[0], 16);
    const g = parseInt(cleanHex[1] + cleanHex[1], 16);
    const b = parseInt(cleanHex[2] + cleanHex[2], 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  } else if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    if (!isNaN(r) && !isNaN(g) && !isNaN(b)) return { r, g, b };
  }
  return null;
}

// Calculate relative luminance to determine whether a custom hex background is light or dark
export function calculateLuminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function getThemeByCompany(company: any): ThemeConfig {
  const primary = company?.primaryColor || "#0f766e";
  const secondary = (company?.secondaryColor || "corporate-clean").trim();
  const lowerSec = secondary.toLowerCase();

  // 1. Direct match on theme preset ID stored in secondaryColor
  if (THEME_REGISTRY[lowerSec]) {
    const basePreset = THEME_REGISTRY[lowerSec];
    return {
      ...basePreset,
      primaryColor: primary,
      fontFamily: company?.fontFamily || basePreset.fontFamily,
    };
  }

  // 2. Custom HEX background color palette evaluation
  const parsedRGB = parseHexColor(secondary);
  if (parsedRGB) {
    const { r, g, b } = parsedRGB;
    const luminance = calculateLuminance(r, g, b);
    const isDark = luminance < 140;
    const hexBg = secondary.startsWith("#") ? secondary : `#${secondary}`;

    if (isDark) {
      // Dynamic Custom Dark Theme Palette
      const cardR = Math.min(255, r + 15);
      const cardG = Math.min(255, g + 15);
      const cardB = Math.min(255, b + 25);
      return {
        id: "custom-dark",
        name: "Custom Dark Theme",
        mode: "dark",
        primaryColor: primary,
        secondaryColor: hexBg,
        bgColor: hexBg,
        cardBg: `rgba(${cardR}, ${cardG}, ${cardB}, 0.85)`,
        cardBorder: "rgba(255, 255, 255, 0.15)",
        textColor: "#f8fafc",
        subtextColor: "#94a3b8",
        inputBg: "rgba(2, 6, 23, 0.7)",
        inputBorder: "rgba(255, 255, 255, 0.2)",
        heroBg: `radial-gradient(ellipse at top, ${primary}40 0%, ${hexBg} 80%)`,
        fontFamily: company?.fontFamily || "Inter",
        description: "Custom dark background theme with optimal contrast",
        badgeStyle: "bg-slate-900/80 text-slate-300 border-slate-700",
      };
    } else {
      // Dynamic Custom Light Theme Palette
      return {
        id: "custom-light",
        name: "Custom Light Theme",
        mode: "light",
        primaryColor: primary,
        secondaryColor: hexBg,
        bgColor: hexBg,
        cardBg: "#ffffff",
        cardBorder: "#e2e8f0",
        textColor: "#0f172a",
        subtextColor: "#475569",
        inputBg: "#ffffff",
        inputBorder: "#cbd5e1",
        heroBg: `linear-gradient(135deg, ${hexBg} 0%, ${primary}18 100%)`,
        fontFamily: company?.fontFamily || "Inter",
        description: "Custom light background theme with crisp text typography",
        badgeStyle: "bg-slate-100 text-slate-800 border-slate-200",
      };
    }
  }

  // 3. Fallback for unrecognized strings
  const isDarkFallback = lowerSec.includes("dark") || lowerSec.includes("night") || lowerSec.startsWith("#0") || lowerSec.startsWith("#1");
  const fallbackPreset = isDarkFallback ? THEME_REGISTRY["cyber-dark"] : THEME_REGISTRY["corporate-clean"];

  return {
    ...fallbackPreset,
    primaryColor: primary,
    fontFamily: company?.fontFamily || fallbackPreset.fontFamily,
  };
}
