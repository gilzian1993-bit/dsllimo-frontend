"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import LogInForm from "./login-form";
import { ShieldCheck, Zap, Users, Mail, Phone } from "lucide-react";

const gradientText = "bg-gradient-to-r from-violet-400 via-purple-400 to-blue-500 bg-clip-text text-transparent";

function useCountUp(end: number, duration = 1800, decimals = 0, suffix = "") {
    const [value, setValue] = useState(0);
    const startRef = useRef<number | null>(null);
    const rafRef = useRef<number>(0);

    useEffect(() => {
        const step = (timestamp: number) => {
            if (startRef.current == null) startRef.current = timestamp;
            const elapsed = timestamp - startRef.current;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = eased * end;
            setValue(current);
            if (progress < 1) rafRef.current = requestAnimationFrame(step);
        };
        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [end, duration, decimals]);

    const display = decimals === 0 ? Math.round(value) : value.toFixed(decimals);
    return `${display}${suffix}`;
}

const LoginPage = () => {
    const countUsers = useCountUp(50, 1800, 0, "K+");
    const countUptime = useCountUp(99.9, 1800, 1, "%");
    const countRating = useCountUp(4.9, 1800, 1, "");

    return (
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 lg:p-8 relative overflow-hidden">
            {/* Background gradient glows */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full bg-violet-500/15 blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[500px] rounded-full bg-blue-500/10 blur-[100px]" />
                <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] rounded-full bg-purple-500/10 blur-[80px]" />
                <div className="absolute -bottom-24 -left-24 w-[450px] h-[450px] rounded-full bg-blue-500/15 blur-[100px]" />
            </div>
            <div className="flex flex-col lg:flex-row w-full max-w-7xl gap-8 lg:gap-12 items-stretch relative z-10">
                {/* Left section - Feature highlights */}
                <div className="flex-1 flex flex-col justify-center space-y-8 lg:max-w-[55%]">
                    <div>
                        <h1 className="text-3xl lg:text-4xl xl:text-5xl font-bold text-white leading-tight">
                            Welcome back to your{" "}
                            <span className={gradientText}>
                                control center
                            </span>
                        </h1>
                        <p className="mt-4 text-base lg:text-lg text-zinc-400 max-w-xl">
                            Access powerful tools and insights to manage your business efficiently and securely.
                        </p>
                    </div>

                    <div className="space-y-4">
                        {/* Bank-Level Security */}
                        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center ring-1 ring-violet-500/30">
                                <ShieldCheck className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg">Bank-Level Security</h3>
                                <p className="text-zinc-400 text-sm mt-1">
                                    Your data is protected with 256-bit encryption and multi-factor authentication.
                                </p>
                            </div>
                        </div>

                        {/* Lightning Fast Performance */}
                        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center ring-1 ring-violet-500/30">
                                <Zap className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg">Lightning Fast Performance</h3>
                                <p className="text-zinc-400 text-sm mt-1">
                                    Experience instant load times and seamless real-time updates across all features.
                                </p>
                            </div>
                        </div>

                        {/* Team Collaboration */}
                        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5 flex items-start gap-4">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center ring-1 ring-violet-500/30">
                                <Users className="w-6 h-6 text-violet-400" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white text-lg">Team Collaboration</h3>
                                <p className="text-zinc-400 text-sm mt-1">
                                    Invite team members and manage permissions with granular access controls.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-8 pt-4">
                        <div>
                            <div className={`text-2xl lg:text-3xl font-bold ${gradientText}`}>{countUsers}</div>
                            <div className="text-sm text-zinc-500">Active Users</div>
                        </div>
                        <div>
                            <div className={`text-2xl lg:text-3xl font-bold ${gradientText}`}>{countUptime}</div>
                            <div className="text-sm text-zinc-500">Uptime</div>
                        </div>
                        <div>
                            <div className={`text-2xl lg:text-3xl font-bold ${gradientText}`}>{countRating}★</div>
                            <div className="text-sm text-zinc-500">User Rating</div>
                        </div>
                    </div>
                </div>

                {/* Right section - Login form + Support */}
                <div className="flex flex-col gap-4 lg:max-w-[400px] w-full justify-center">
                    <Suspense fallback={<div>Loading...</div>}>
                        <LogInForm />
                    </Suspense>
                    {/* Need Help card */}
                    {/* <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-5">
                        <h3 className="font-semibold text-white text-lg mb-4">Need Help?</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 ring-1 ring-violet-500/30">
                                    <Mail className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Email Support</div>
                                    <div className="text-sm text-zinc-400">info@devsquare.com</div>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-blue-500/20 flex items-center justify-center flex-shrink-0 ring-1 ring-violet-500/30">
                                    <Phone className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <div className="text-sm font-medium text-white">Whatsapp Support</div>
                                    <Link href="https://wa.me/923451136239" target="_blank" className="text-sm text-zinc-400">+92 345 1136239</Link>
                                </div>
                            </div>
                        </div>
                    </div> */}
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
