import { FC, MouseEventHandler } from "react";
import { Button } from "@/components/ui/button";
import { Maximize2 } from "lucide-react";
import {
    Tooltip,
    TooltipArrow,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

type CustomDocument = Document & {
    mozCancelFullScreen?: () => void;
};
const FullScreenToggle: FC = () => {
    const toggleFullScreen: MouseEventHandler<HTMLButtonElement> = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch((err) => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <Button
                        onClick={toggleFullScreen}
                        variant="ghost"
                        size="icon"
                        className="relative md:h-9 md:w-9 h-8 w-8 hover:bg-default-100 dark:hover:bg-default-200
 data-[state=open]:bg-default-100 dark:data-[state=open]:bg-default-200
 hover:text-primary text-default-500 dark:text-default-800 rounded-full "
                    >
                        <Maximize2 className="h-5 w-5" />
                    </Button>
                </TooltipTrigger>
                <TooltipContent>
                    <TooltipArrow className="fill-primary" />
                    <p>Full Screen</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
};

export default FullScreenToggle;