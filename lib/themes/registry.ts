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
    cardBg: "rgba(15, 23, 42, 0.75)",
    cardBorder: "rgba(56, 189, 248, 0.25)",
    textColor: "#f8fafc",
    subtextColor: "#94a3b8",
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
    cardBg: "rgba(24, 15, 46, 0.75)",
    cardBorder: "rgba(168, 85, 247, 0.3)",
    textColor: "#faf5ff",
    subtextColor: "#c084fc",
    heroBg: "radial-gradient(ellipse at top, #581c87 0%, #090514 75%)",
    fontFamily: "Outfit",
    description: "Deep violet night aesthetic with vibrant purple gradients & glow",
    badgeStyle: "bg-purple-950/80 text-purple-300 border-purple-800/80",
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
    heroBg: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
    fontFamily: "Inter",
    description: "Crisp, professional SaaS layout with indigo & teal accents",
    badgeStyle: "bg-teal-50 text-teal-800 border-teal-200",
  },
  "emerald-biotech": {
    id: "emerald-biotech",
    name: "Emerald Bio & Eco Tech",
    mode: "dark",
    primaryColor: "#10b981",
    secondaryColor: "#059669",
    bgColor: "#022c22",
    cardBg: "rgba(6, 78, 59, 0.75)",
    cardBorder: "rgba(16, 185, 129, 0.35)",
    textColor: "#ecfdf5",
    subtextColor: "#6ee7b7",
    heroBg: "radial-gradient(ellipse at top, #047857 0%, #022c22 75%)",
    fontFamily: "Outfit",
    description: "Forest dark environment with mint green bio-tech highlights",
    badgeStyle: "bg-emerald-950/80 text-emerald-300 border-emerald-800/80",
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
    heroBg: "linear-gradient(135deg, #f3e8ff 0%, #ffe4e6 100%)",
    fontFamily: "Poppins",
    description: "High-energy startup look with violet-rose gradients",
    badgeStyle: "bg-purple-100 text-purple-900 border-purple-300",
  },
};

export function getThemeByCompany(company: any): ThemeConfig {
  const primary = company?.primaryColor?.toLowerCase() || "#0f766e";
  const secondary = company?.secondaryColor?.toLowerCase() || "#0f172a";

  // Check direct theme ID match stored in secondaryColor or theme key
  if (THEME_REGISTRY[secondary]) {
    return THEME_REGISTRY[secondary];
  }

  // Find matching preset by primary color
  const matched = Object.values(THEME_REGISTRY).find(
    (t) => t.primaryColor.toLowerCase() === primary
  );
  if (matched) return matched;

  // Infer dark vs light mode from secondary color hex brightness
  const isDarkSecondary =
    secondary.startsWith("#0") ||
    secondary.startsWith("#1") ||
    secondary.startsWith("#2") ||
    secondary.includes("030712") ||
    secondary.includes("090514");

  if (isDarkSecondary) {
    return {
      ...THEME_REGISTRY["cyber-dark"],
      primaryColor: company.primaryColor || "#06b6d4",
      secondaryColor: company.secondaryColor || "#0f172a",
      fontFamily: company.fontFamily || "Inter",
    };
  }

  return {
    ...THEME_REGISTRY["corporate-clean"],
    primaryColor: company.primaryColor || "#0f766e",
    secondaryColor: company.secondaryColor || "#0369a1",
    fontFamily: company.fontFamily || "Inter",
  };
}
