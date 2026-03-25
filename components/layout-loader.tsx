"use client";
import React from "react";
import Image from "next/image";
import { Loader2 } from "lucide-react";
const LayoutLoader = () => {
    return (
        <div className=" h-screen flex items-center justify-center flex-col space-y-2">
            <Image src="/logo/loader.png" alt="logo" width={100} height={100} />
            <span className=" inline-flex gap-1">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
            </span>
        </div>
    );
};

export default LayoutLoader;
