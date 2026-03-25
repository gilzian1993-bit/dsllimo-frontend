"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth.schema";
import { useLogin } from "@/hooks/auth-query/use-auth";

const LogInForm = () => {
    const [passwordType, setPasswordType] = React.useState<string>("password");

    const togglePasswordType = () => {
        setPasswordType((prev) => (prev === "password" ? "text" : "password"));
    };

    const { mutate: login, isPending } = useLogin();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });


    const handleFormSubmit = (data: LoginFormData) => {
        login(data);
    };

    const inputBase =
        "w-full h-11 rounded-xl bg-zinc-800/80 border border-zinc-700 text-white placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 transition pl-10 pr-4";

    return (
        <div className="rounded-2xl bg-zinc-900/80 border border-zinc-800 p-6 lg:p-8 w-full">
            <h2 className="text-2xl font-bold text-white text-center">Sign in</h2>
            <p className="text-zinc-400 text-center text-sm mt-2 mb-6">
                Welcome back! Please enter your details.
            </p>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
                <div>
                    <Label htmlFor="email" className="text-sm font-medium text-white mb-2 block">
                        Email address
                    </Label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                        <input
                            {...register("email")}
                            type="email"
                            id="email"
                            className={cn(inputBase, {
                                "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50": errors.email,
                            })}
                            placeholder="name@company.com"
                        />
                    </div>
                    {errors.email && (
                        <p className="text-red-400 text-sm mt-1.5">{errors.email.message}</p>
                    )}
                </div>

                <div>
                    <Label htmlFor="password" className="text-sm font-medium text-white mb-2 block">
                        Password
                    </Label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500 pointer-events-none" />
                        <input
                            {...register("password")}
                            type={passwordType}
                            id="password"
                            className={cn(inputBase, "pr-11", {
                                "border-red-500/50 focus:ring-red-500/50 focus:border-red-500/50": errors.password,
                            })}
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordType}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-zinc-400 transition p-1"
                            aria-label={passwordType === "password" ? "Show password" : "Hide password"}
                        >
                            {passwordType === "password" ? (
                                <Eye className="w-5 h-5" />
                            ) : (
                                <EyeOff className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-red-400 text-sm mt-1.5">{errors.password.message}</p>
                    )}
                </div>
                <Button
                    type="submit"
                    className="w-full h-11 rounded-xl bg-gradient-to-r from-violet-500 to-blue-600 hover:from-violet-600 hover:to-blue-700 text-white font-medium border-0 shadow-lg shadow-violet-500/25"
                    size="lg"
                    disabled={isPending}
                >
                    <>
                        {isPending ? (
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        ) : (
                            <>
                                Sign in
                                <ArrowRight className="ml-2 w-4 h-4" />
                            </>
                        )}
                    </>
                </Button>
            </form>
        </div>
    );
};

export default LogInForm;
