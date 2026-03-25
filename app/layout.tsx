import "./assets/scss/globals.scss";
import { siteConfig } from "@/config/site";
import Providers from "@/provider/providers";
import { ThemeVarsStyle } from "@/components/theme-vars";
import "simplebar-react/dist/simplebar.min.css";

export const metadata = {
    title: {
        default: siteConfig.name,
        template: `%s - ${siteConfig.name}`,
    },
    description: siteConfig.description,
};

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <ThemeVarsStyle />
            </head>
            <body suppressHydrationWarning>
                <Providers>
                    {children}
                </Providers>
            </body>
        </html>
    );
}
