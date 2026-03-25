export type ThemeCssVars = Record<string, string>;

export interface ThemeConfig {
    name: string;
    label: string;
    activeColor: { light: string; dark: string };
    cssVars: {
        light: ThemeCssVars;
        dark: ThemeCssVars;
    };
}

/** Single source of truth for all theme colors */
export const themes: ThemeConfig[] = [
    {
        name: "violet",
        label: "Violet",
        activeColor: {
            light: "186 100% 33%",
            dark: "186 100% 33%",
        },
        cssVars: {
            light: {
                background: "0 0% 100%",
                foreground: "222.2 84% 4.9%",
                muted: "220 14.3% 95.9%",
                "muted-foreground": "215.4 16.3% 46.9%",
                popover: "0 0% 100%",
                "popover-foreground": "222.2 84% 4.9%",
                card: "0 0% 100%",
                "card-foreground": "222.2 84% 4.9%",
                border: "214.3 31.8% 91.4%",
                input: "214.3 31.8% 91.4%",
                "primary-50": "183 100% 97%",
                "primary-100": "185 96% 90%",
                "primary-200": "186 94% 82%",
                "primary-300": "187 92% 69%",
                "primary-400": "188 86% 53%",
                "primary-500": "186 100% 33%",
                "primary-600": "189 92% 28%",
                "primary-700": "191 80% 24%",
                "primary-800": "193 70% 21%",
                "primary-900": "194 63% 18%",
                "primary-950": "196 79% 12%",
                primary: "186 100% 33%",
                "primary-foreground": "0 0% 100%",
                secondary: "214.3 31.8% 91.4%",
                "secondary-foreground": "222.2 47.4% 11.2%",
                accent: "214.3 31.8% 91.4%",
                "accent-foreground": "222.2 47.4% 11.2%",
                destructive: "0 84.2% 60.2%",
                "destructive-foreground": "0 85.7% 97.3",
                ring: "186 100% 33%",
                success: "142.1 70.6% 45.3%",
                "success-foreground": "138.5 76.5% 96.7%",
                warning: "24.6 95% 53.1%",
                "warning-foreground": "33.3 100% 96.5%",
                info: "188.7 94.5% 42.7%",
                "info-foreground": "183.2 100% 96.3%",
                "default-50": "210 40% 98%",
                "default-100": "210 40% 96.1%",
                "default-200": "214.3 31.8% 91.4%",
                "default-300": "212.7 26.8% 83.9%",
                "default-400": "215 20.2% 65.1%",
                "default-500": "215.4 16.3% 46.9%",
                "default-600": "215.3 19.3% 34.5%",
                "default-700": "215.3 25% 26.7%",
                "default-800": "217.2 32.6% 17.5%",
                "default-900": "222.2 47.4% 11.2%",
                "default-950": "222.2 84% 4.9%",
                chartGird: "214.3 31.8% 91.4%",
                chartLabel: "215.3 19.3% 34.5%",
                radius: "0.5rem",
                "nextra-primary-hue": "250deg",
            },
            dark: {
                background: "222.2 47.4% 11.2%",
                foreground: "210 40% 98%",
                muted: "215 27.9% 16.9%",
                "muted-foreground": "217.9 10.6% 64.9%",
                popover: "222.2 47.4% 11.2%",
                "popover-foreground": "210 40% 98%",
                card: "215 27.9% 16.9%",
                "card-foreground": "210 40% 98%",
                border: "215.3 25% 26.7%",
                input: "217.2 32.6% 17.5%",
                primary: "186 100% 33%",
                "primary-foreground": "0 0% 100%",
                secondary: "215.3 25% 26.7%",
                "secondary-foreground": "210 40% 98%",
                accent: "215 27.9% 16.9%",
                "accent-foreground": "210 40% 98%",
                destructive: "0 84.2% 60.2%",
                "destructive-foreground": "0 85.7% 97.3",
                ring: "186 100% 33%",
                success: "142.1 70.6% 45.3%",
                "success-foreground": "138.5 76.5% 96.7%",
                info: "188.7 94.5% 42.7%",
                "info-foreground": "183.2 100% 96.3%",
                warning: "24.6 95% 53.1%",
                "warning-foreground": "33.3 100% 96.5%",
                "default-950": "210 40% 98%",
                "default-900": "210 40% 96.1%",
                "default-800": "214.3 31.8% 91.4%",
                "default-700": "212.7 26.8% 83.9%",
                "default-600": "215 20.2% 65.1%",
                "default-500": "215.4 16.3% 46.9%",
                "default-300": "215.3 19.3% 34.5%",
                "default-200": "215.3 25% 26.7%",
                "default-100": "217.2 32.6% 17.5%",
                "default-50": "222.2 47.4% 11.2%",
                chartGird: "215.3 25% 26.7%",
                chartLabel: "215 20.2% 65.1%",
            },
        },
    },
];

function varsToCss(vars: ThemeCssVars): string {
    return Object.entries(vars)
        .map(([key, value]) => `    --${key}: ${value};`)
        .join("\n");
}

/** Generates CSS for :root (light) and .dark from themes.ts - single source of truth */
export function getThemeCssAll(themeName: string): string {
    const theme = themes.find((t) => t.name === themeName);
    if (!theme) {
        return "/* Theme not found: " + themeName + " */";
    }
    const lightCss = varsToCss(theme.cssVars.light);
    const darkCss = varsToCss(theme.cssVars.dark);
    return `:root, .theme-${themeName} {\n${lightCss}\n}\n\n.dark, .dark .theme-${themeName} {\n${darkCss}\n}`;
}
