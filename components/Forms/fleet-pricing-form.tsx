import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useFleets } from "@/hooks/use-fleet";
import { Loader2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import {
    getDistanceUnitLabel,
    getDistanceUnitShortLabel,
} from "@/lib/utils/formatters";

const fleetPricingSchema = z.object({
    fleetId: z.string().min(1, "Fleet is required"),
    minDistance: z.coerce.number().min(0, "Minimum distance is required"),
    maxDistance: z.coerce.number().nullable().optional(),
    price: z.coerce.number().min(0, "Price is required"),
    increasePercentage: z.coerce.number().min(0, "Increase percentage cannot be negative").default(0),
    type: z.enum(["fixed", "per_km"]),
    isActive: z.boolean().default(true),
});

type FleetPricingFormValues = z.infer<typeof fleetPricingSchema>;

interface FleetPricingFormProps {
    onSubmit: (data: FleetPricingFormValues) => Promise<void>;
    initialData?: Partial<FleetPricingFormValues>;
    isLoading?: boolean;
}

export const FleetPricingForm = ({ onSubmit, initialData, isLoading }: FleetPricingFormProps) => {
    const { data: fleetsData, isLoading: isLoadingFleets } = useFleets();

    const form = useForm<FleetPricingFormValues>({
        resolver: zodResolver(fleetPricingSchema),
        defaultValues: {
            fleetId: initialData?.fleetId || "",
            minDistance: initialData?.minDistance || 0,
            maxDistance: initialData?.maxDistance || null,
            price: initialData?.price || 0,
            increasePercentage: initialData?.increasePercentage ?? 0,
            type: initialData?.type || "fixed",
            isActive: initialData?.isActive ?? true,
        },
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="fleetId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Fleet</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a fleet" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {fleetsData?.data?.map((fleet: any) => (
                                        <SelectItem key={fleet._id} value={fleet._id}>
                                            {fleet.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="minDistance"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Min Distance ({getDistanceUnitShortLabel()})</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="maxDistance"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Max Distance ({getDistanceUnitShortLabel()}) - optional</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value || ""} onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : null)} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="increasePercentage"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Increase Percentage (%)</FormLabel>
                                <FormControl>
                                    <Input type="number" min="0" step="0.01" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <div className="grid grid-cols-1">
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Pricing Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="fixed">Fixed</SelectItem>
                                        <SelectItem value="per_km">Per {getDistanceUnitLabel().slice(0, -1)}</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
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
                                <div className="text-sm text-muted-foreground">
                                    Whether this pricing range is currently active
                                </div>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {initialData?.fleetId ? "Update Pricing" : "Add Pricing"}
                </Button>
            </form>
        </Form>
    );
};
