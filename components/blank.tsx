import React from "react";
import { cn } from "@/lib/utils";

interface BlankProps {
    children: React.ReactNode
    img?: React.ReactNode
    className?: string
}
const Blank = ({ children, img, className }: BlankProps) => {
    return (
        <div className={cn("text-center", className)}>
            <h1>hello</h1>
        </div>
    );
};

export default Blank;
