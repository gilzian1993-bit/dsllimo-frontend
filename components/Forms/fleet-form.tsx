"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Upload, Pencil, X, CheckCircle2 } from "lucide-react";
import { uploadImage } from "@/lib/api/upload";
import Image from "next/image";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

const fleetSchema = z.object({
    name: z.string().min(2, "Name is required"),
    description: z.string().optional(),
    image: z.string().url("Image is required"),
    passengers: z.coerce.number().min(1, "Passengers count is required"),
    suitcases: z.coerce.number().min(0, "Suitcases count is required"),
    timePeriod: z.string().optional(),
    carType: z.string().optional(),
    isActive: z.boolean().default(true),
    allowRequestQuote: z.boolean().default(false),
});

type FleetFormValues = z.infer<typeof fleetSchema>;

interface FleetFormProps {
    onSubmit: (data: FleetFormValues) => Promise<void>;
    initialData?: Partial<FleetFormValues>;
    isLoading?: boolean;
}

export const FleetForm = ({ onSubmit, initialData, isLoading }: FleetFormProps) => {
    const [isUploading, setIsUploading] = React.useState(false);
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const form = useForm<FleetFormValues>({
        resolver: zodResolver(fleetSchema),
        defaultValues: {
            name: initialData?.name || "",
            description: initialData?.description || "",
            image: initialData?.image || "",
            passengers: initialData?.passengers || 0,
            suitcases: initialData?.suitcases || 0,
            timePeriod: initialData?.timePeriod || "",
            carType: initialData?.carType || "",
            isActive: initialData?.isActive ?? true,
            allowRequestQuote: initialData?.allowRequestQuote ?? false,
        },
    });

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        try {
            const result = await uploadImage(file);
            form.setValue("image", result.url);
            toast.success("Image uploaded successfully");
        } catch (error: any) {
            toast.error(error.message || "Failed to upload image");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="">Fleet Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="e.g. Standard Sedan" {...field} color={fieldState.error ? "destructive" : "default"} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-gray-100 pt-4">
                    <FormField
                        control={form.control}
                        name="passengers"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="">No. of Passengers</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="4" {...field} color={fieldState.error ? "destructive" : "default"} />
                                </FormControl>
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="suitcases"
                        render={({ field, fieldState }) => (
                            <FormItem>
                                <FormLabel className="">No. of Suitcases</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="2" {...field} color={fieldState.error ? "destructive" : "default"} />
                                </FormControl>
                            </FormItem>
                        )}
                    />

                </div>
                <FormField
                    control={form.control}
                    name="timePeriod"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="">Time Period (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. 2 Hour, 3 Hour" {...field} color={fieldState.error ? "destructive" : "default"} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="carType"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="">Car Type (Optional)</FormLabel>
                            <FormControl>
                                <Input placeholder="e.g. Sedan, SUV" {...field} color={fieldState.error ? "destructive" : "default"} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field, fieldState }) => (
                        <FormItem>
                            <FormLabel className="">Description (Optional)</FormLabel>
                            <FormControl>
                                <Textarea placeholder="Enter fleet description..." {...field} color={fieldState.error ? "destructive" : "default"} />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <div className="space-y-4">
                    <FormLabel>Image</FormLabel>
                    <FormField
                        control={form.control}
                        name="image"
                        render={({ fieldState }) => (
                            <FormItem>
                                <FormControl>
                                    <div className={cn(
                                        "flex flex-col gap-4 rounded-lg transition-colors border-2 border-transparent p-0.5",
                                        fieldState.error && "border-destructive"
                                    )}>
                                        {form.watch("image") ? (
                                            <div className="space-y-2">
                                                <div className="relative group h-48 w-full rounded-lg overflow-hidden border bg-muted">
                                                    <Image
                                                        src={form.watch("image")}
                                                        alt="Fleet"
                                                        fill
                                                        className="object-cover"
                                                    />
                                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                                                        <Button
                                                            type="button"
                                                            color="secondary"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-full"
                                                            onClick={() => fileInputRef.current?.click()}
                                                            disabled={isUploading}
                                                        >
                                                            <Pencil className="h-4 w-4" />
                                                        </Button>
                                                        <Button
                                                            type="button"
                                                            color="destructive"
                                                            size="icon"
                                                            className="h-10 w-10 rounded-full"
                                                            onClick={() => form.setValue("image", "")}
                                                            disabled={isUploading}
                                                        >
                                                            <X className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                    {isUploading && (
                                                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                                                            <Loader2 className="h-8 w-8 animate-spin text-white" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-green-600 font-medium animate-in fade-in slide-in-from-top-1">
                                                    <CheckCircle2 className="h-4 w-4" />
                                                    Image uploaded successfully
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex-1">
                                                <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition-colors">
                                                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                        {isUploading ? (
                                                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                                                        ) : (
                                                            <>
                                                                <Upload className="h-8 w-8 text-gray-500 mb-2" />
                                                                <p className="text-sm text-gray-500 font-medium">Click to upload image</p>
                                                                <p className="text-xs text-gray-400 mt-1">PNG, JPG or WebP (max. 2MB)</p>
                                                            </>
                                                        )}
                                                    </div>
                                                    <input
                                                        type="file"
                                                        className="hidden"
                                                        onChange={handleImageUpload}
                                                        disabled={isUploading}
                                                        accept="image/*"
                                                    />
                                                </label>
                                            </div>
                                        )}
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            className="hidden"
                                            onChange={handleImageUpload}
                                            disabled={isUploading}
                                            accept="image/*"
                                        />
                                    </div>
                                </FormControl>
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Status</FormLabel>
                                <FormDescription>
                                    When disabled, this fleet cannot be selected directly.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="allowRequestQuote"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Allow Request Quote</FormLabel>
                                <FormDescription>
                                    Show "Request a Quote" on website and redirect to contact page.
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </FormItem>
                    )}
                />



                <Button type="submit" className="w-full" disabled={isLoading || isUploading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData?.name ? "Update Fleet" : "Add Fleet"}
                </Button>
            </form>
        </Form>
    );
};
