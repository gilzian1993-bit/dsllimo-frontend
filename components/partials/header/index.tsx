"use client";
import React from "react";
import { cn } from "@/lib/utils";
import ThemeButton from "./theme-button";
import { useSidebar, useThemeStore } from "@/store";
import ProfileInfo from "./profile-info";
import VerticalHeader from "./vertical-header";
import { useMediaQuery } from "@/hooks/use-media-query";
import MobileMenuHandler from "./mobile-menu-handler";
import FullScreen from "./full-screen";


const NavTools = ({
    isDesktop
}: {
    isDesktop: boolean;
}) => {
    return (
        <div className="nav-tools flex items-center gap-2">
            {isDesktop && <FullScreen />}
            <ThemeButton />
            <div className="pl-2">
                <ProfileInfo />
            </div>
            {!isDesktop && <MobileMenuHandler />}
        </div>
    );
};
const Header = () => {
    const { collapsed } = useSidebar();
    const { navbarType } = useThemeStore();
    const isDesktop = useMediaQuery("(min-width: 1280px)");
    if (navbarType === "hidden") {
        return null;
    }

    return (
        <header
            className={cn("has-sticky-header rounded-md z-50 ", {
                "xl:ml-[96px]": collapsed,
                "xl:ml-[272px]": !collapsed,
                "sticky top-6": navbarType === "sticky",
            })}
        >
            <div className="xl:mx-16 mx-4">
                <div className="w-full bg-card/90 backdrop-blur-lg md:px-6 px-[15px] py-3 rounded-md my-6 shadow-md border-b">
                    <div className="flex justify-between items-center h-full">
                        <VerticalHeader />
                        <NavTools
                            isDesktop={isDesktop}
                        />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
