import React from "react";
import Image from "next/image";
import { useSidebar } from "@/store";

const SidebarLogo = () => {
    const { collapsed } = useSidebar();

    return (
        <div className="px-3 py-3">
            <div className="flex items-center justify-center">
                <div className="flex items-center justify-center">
                    <Image
                        src="/logo/logo.png"
                        alt="DSL logo"
                        width={collapsed ? 44 : 132}
                        height={collapsed ? 44 : 132}
                        className="h-auto w-auto object-contain"
                        priority
                    />
                </div>
            </div>
        </div>
    );
};

export default SidebarLogo;
