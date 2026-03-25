"use client";
import React from "react";
import { useSidebar } from "@/store";
import { useMediaQuery } from "@/hooks/use-media-query";
import PopoverSidebar from "./popover";
import MobileSidebar from "./mobile-sidebar";

const Sidebar = () => {
    const isDesktop = useMediaQuery("(min-width: 1280px)");

    if (!isDesktop) {
        return <MobileSidebar />;
    }

    return <PopoverSidebar />;
};

export default Sidebar;
