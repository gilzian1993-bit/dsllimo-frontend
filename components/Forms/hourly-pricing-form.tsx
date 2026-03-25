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
    FormDescription,
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
import { PackageType } from "@/lib/types/hourly-package.types";
import {
    getDistanceUnitLabel,
} from "@/lib/utils/formatters";

const hourlyPricingSchema = z.object({
    fleetId: z.string().min(1, "Fleet is required"),
    packageType: z.enum(["hourly", "day", "week"]),
    duration: z.coerce.number().min(1, "Duration must be at least 1"),
    includedMiles: z.coerce.number().min(0, "Included miles cannot be less than 0"),
    price: z.coerce.number().min(0, "Price is required"),
    extraMileRate: z.coerce.number().min(0, "Extra mile rate cannot be less than 0"),
    isActive: z.boolean().default(true),
});

type HourlyPricingFormValues = z.infer<typeof hourlyPricingSchema>;

interface HourlyPricingFormProps {
    onSubmit: (data: HourlyPricingFormValues) => Promise<void>;
    initialData?: Partial<HourlyPricingFormValues>;
    isLoading?: boolean;
}

export const HourlyPricingForm = ({ onSubmit, initialData, isLoading }: HourlyPricingFormProps) => {
    const { data: fleetsData } = useFleets();

    const form = useForm<HourlyPricingFormValues>({
        resolver: zodResolver(hourlyPricingSchema),
        defaultValues: {
            fleetId: initialData?.fleetId || "",
            packageType: (initialData?.packageType as PackageType) || "hourly",
            duration: initialData?.duration || 1,
            includedMiles: initialData?.includedMiles || 0,
            price: initialData?.price || 0,
            extraMileRate: initialData?.extraMileRate || 0,
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
                        name="packageType"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Service Type</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="hourly">Hourly</SelectItem>
                                        <SelectItem value="day">Full Day</SelectItem>
                                        <SelectItem value="week">Weekly</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="duration"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Duration ({form.watch("packageType") === "hourly" ? "Hours" : form.watch("packageType") === "day" ? "Days" : "Weeks"})</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
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
                                <FormLabel>Base Price</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="includedMiles"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Included {getDistanceUnitLabel()}</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="extraMileRate"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Extra {getDistanceUnitLabel().slice(0, -1)} Rate</FormLabel>
                            <FormControl>
                                <Input type="number" step="0.01" {...field} />
                            </FormControl>
                            <FormDescription>
                                Fee charged for every {getDistanceUnitLabel().toLowerCase().slice(0, -1)} exceeded beyond included distance.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="isActive"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Active Status</FormLabel>
                                <div className="text-sm text-muted-foreground">
                                    Whether this service type is currently available for booking
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
                    {initialData?.packageType ? "Update Hourly Transfer" : "Add Hourly Transfer"}
                </Button>
            </form>
        </Form>
    );
};
