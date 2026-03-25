"use client";
import React from "react";
import Header from "@/components/partials/header";
import Sidebar from "@/components/partials/sidebar";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/store";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useMounted } from "@/hooks/use-mounted";
import LayoutLoader from "@/components/layout-loader";

const DashBoardLayoutProvider = ({ children }: { children: React.ReactNode }) => {
    const { collapsed } = useSidebar();
    const location = usePathname();
    const mounted = useMounted();

    if (!mounted) {
        return <LayoutLoader />;
    }

    return (
        <>
            <Header />
            <Sidebar />

            <div
                className={cn("content-wrapper transition-all duration-150 ", {
                    "xl:ml-[96px]": collapsed,
                    "xl:ml-[272px]": !collapsed,
                })}
            >
                <div className="pt-6 pb-8 px-4 page-min-height-semibox">
                    <div className="semibox-content-wrapper ">
                        <LayoutWrapper
                            location={location}
                        >
                            {children}
                        </LayoutWrapper>
                    </div>
                </div>
            </div>
        </>
    );
};

export default DashBoardLayoutProvider;

const LayoutWrapper = ({
    children,
    location
}: {
    children: React.ReactNode,
    location: string
}) => {
    return (
        <motion.div
            key={location}
            initial="pageInitial"
            animate="pageAnimate"
            exit="pageExit"
            variants={{
                pageInitial: {
                    opacity: 0,
                    y: 50,
                },
                pageAnimate: {
                    opacity: 1,
                    y: 0,
                },
                pageExit: {
                    opacity: 0,
                    y: -50,
                },
            }}
            transition={{
                type: "tween",
                ease: "easeInOut",
                duration: 0.5,
            }}
        >
            <main>{children}</main>
        </motion.div>
    );
};
