import { siteConfig } from "@/config/site";
import { getThemeCssAll } from "@/config/thems";

/** Renders initial theme CSS from themes.ts (server) so there’s no flash. */
export function ThemeVarsStyle() {
    const css = getThemeCssAll(siteConfig.theme);
    return <style id="theme-vars" dangerouslySetInnerHTML={{ __html: css }} />;
}
