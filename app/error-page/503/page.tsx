"use client"
import { Button } from "@/components/ui/button";
import Link from "next/link";
const ErrorPage = () => {
    return (
        <div className='min-h-screen overflow-y-auto flex justify-center items-center p-10'>
            <div className='flex flex-col items-center'>
                <div className="mt-16 text-center">
                    <div className="text-xl md:text-4xl lg:text-5xl font-semibold text-default-900 ">Ops! Service Unavailable Error</div>
                    <div className="mt-3 text-default-600 text-sm md:text-base">
                        The page you are looking for might have been removed had <br /> its name changed or is temporarily unavailable.
                    </div>
                    <Button asChild className="mt-9 md:min-w-[300px]" size="lg">
                        <Link href="/">Go to Homepage</Link>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ErrorPage;