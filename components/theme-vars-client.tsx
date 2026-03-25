"use client";

import { useEffect } from "react";
import { useThemeStore } from "@/store";
import { getThemeCssAll } from "@/config/thems";

/** Updates #theme-vars when the theme changes (e.g. from theme picker or persisted store). */
export function ThemeVarsClient() {
    const theme = useThemeStore((s) => s.theme);

    useEffect(() => {
        const css = getThemeCssAll(theme);
        const el = document.getElementById("theme-vars");
        if (el) el.textContent = css;
    }, [theme]);

    return null;
}
