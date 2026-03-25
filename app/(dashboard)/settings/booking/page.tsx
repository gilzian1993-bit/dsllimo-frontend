"use client";

import React, { useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Percent, Plane, Car, UserCheck, CheckCircle2, Plus, Trash2 } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useBookingSettings, useUpdateBookingSettings } from "@/hooks/use-booking-setting";
import { getDashboardCurrencyLabel } from "@/lib/utils/formatters";

const serviceItemSchema = z.object({
    price: z.coerce.number().min(0, "Price must be positive"),
    isActive: z.boolean().default(false),
});

const childSeatSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(1, "Name is required"),
    description: z.string().optional(),
    price: z.coerce.number().min(0, "Price must be positive"),
    isActive: z.boolean().default(true),
});

const bookingSettingsSchema = z.object({
    taxRate: z.coerce.number().min(0).max(100, "Tax rate cannot exceed 100%"),
    gratuityRate: z.coerce.number().min(0).max(100, "Gratuity rate cannot exceed 100%"),
    discounts: z.object({
        signup: z.coerce.number().min(0).max(100, "Signup discount cannot exceed 100%"),
        guest: z.coerce.number().min(0).max(100, "Guest discount cannot exceed 100%"),
        returnTrip: z.object({
            signup: z.coerce.number().min(0).max(100, "Signup return-trip discount cannot exceed 100%"),
            guest: z.coerce.number().min(0).max(100, "Guest return-trip discount cannot exceed 100%"),
        }),
    }),
    stopFee: serviceItemSchema,
    airportPickup: serviceItemSchema,
    outbound: z.object({
        meetAndGreet: serviceItemSchema,
    }),
    return: z.object({
        meetAndGreet: serviceItemSchema,
    }),
    childSeats: z.array(childSeatSchema),
});

type BookingSettingsFormValues = z.infer<typeof bookingSettingsSchema>;

const PriceItem = ({ title, icon, path, form }: any) => {
    return (
        <div className="space-y-3 pb-4 last:pb-0">
            <div className="flex items-center justify-between">
                <FormLabel className="text-sm font-medium flex items-center gap-2">
                    {icon}
                    {title} ({getDashboardCurrencyLabel()})
                </FormLabel>
                <FormField
                    control={form.control}
                    name={`${path}.isActive`}
                    render={({ field }) => (
                        <div className="flex items-center gap-2">
                            <span className="text-xs text-muted-foreground">{field.value ? "Active" : "Inactive"}</span>
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                        </div>
                    )}
                />
            </div>
            <FormField
                control={form.control}
                name={`${path}.price`}
                render={({ field }) => (
                    <FormItem>
                        <FormControl>
                            <Input type="number" step="0.01" {...field} className="bg-background transition-all focus:ring-2 focus:ring-primary/20" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
    );
};

export default function BookingSettingsPage() {
    const { data: settings, isLoading } = useBookingSettings();
    const { mutateAsync: updateSettings, isPending: isUpdating } = useUpdateBookingSettings();

    const form = useForm<BookingSettingsFormValues>({
        resolver: zodResolver(bookingSettingsSchema),
        defaultValues: {
            taxRate: 0,
            gratuityRate: 0,
            discounts: {
                signup: 10,
                guest: 5,
                returnTrip: {
                    signup: 15,
                    guest: 15,
                },
            },
            stopFee: { price: 0, isActive: false },
            airportPickup: { price: 0, isActive: false },
            outbound: {
                meetAndGreet: { price: 0, isActive: false },
            },
            return: {
                meetAndGreet: { price: 0, isActive: false },
            },
            childSeats: [],
        },
    });

    useEffect(() => {
        if (settings) {
            const rawReturnTripDiscount = settings.discounts?.returnTrip as unknown;
            const normalizedReturnTripDiscount =
                typeof rawReturnTripDiscount === "number"
                    ? {
                        signup: rawReturnTripDiscount,
                        guest: rawReturnTripDiscount,
                    }
                    : {
                        signup: settings.discounts?.returnTrip?.signup ?? 15,
                        guest: settings.discounts?.returnTrip?.guest ?? 15,
                    };

            form.reset({
                taxRate: settings.taxRate,
                gratuityRate: settings.gratuityRate,
                discounts: {
                    signup: settings.discounts?.signup ?? 10,
                    guest: settings.discounts?.guest ?? 5,
                    returnTrip: normalizedReturnTripDiscount,
                },
                stopFee: settings.stopFee || { price: 0, isActive: false },
                airportPickup: settings.airportPickup || { price: 0, isActive: false },
                outbound: settings.outbound || {
                    meetAndGreet: { price: 0, isActive: false },
                },
                return: settings.return || {
                    meetAndGreet: { price: 0, isActive: false },
                },
                childSeats: settings.childSeats || [],
            });
        }
    }, [settings, form]);

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "childSeats",
    });

    const onSubmit = async (data: BookingSettingsFormValues) => {
        await updateSettings(data);
    };

    if (isLoading) {
        return (
            <div className="flex h-96 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="space-y-6 max-w-6xl mx-auto">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight text-foreground/90">Price Settings - Services Fee</h1>
                <p className="text-muted-foreground">
                    Configure pricing for additional services on outbound and return journeys
                </p>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card className="shadow-sm border-muted/60">
                        <CardHeader className="border-b bg-muted/5 pb-4">
                            <CardTitle className="text-xl font-semibold">Service Fees</CardTitle>
                            <CardDescription className="text-xs">
                                Configure pricing for additional services on outbound and return journeys
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-8">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                                {/* Outbound Journey */}
                                <div className="space-y-6">
                                    <div className="border-b pb-2 mb-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            Outbound Journey
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Fees for outbound trip extras</p>
                                    </div>
                                    <PriceItem
                                        title="Meet & Greet Fee"
                                        path="outbound.meetAndGreet"
                                        icon={<UserCheck className="h-4 w-4 text-primary/70" />}
                                        form={form}
                                    />
                                </div>

                                {/* Return Journey */}
                                <div className="space-y-6">
                                    <div className="border-b pb-2 mb-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            Return Journey
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Fees for return trip extras</p>
                                    </div>
                                    <PriceItem
                                        title="Meet & Greet Fee"
                                        path="return.meetAndGreet"
                                        icon={<UserCheck className="h-4 w-4 text-primary/70" />}
                                        form={form}
                                    />
                                </div>
                            </div>

                            <div className="mt-12 pt-8 border-t">
                                <div className="max-w-md space-y-8">
                                    <div className="border-b pb-2 mb-6">
                                        <h3 className="text-lg font-bold flex items-center gap-2">
                                            Unified Fees
                                        </h3>
                                        <p className="text-sm text-muted-foreground">Global fees applied to all journeys</p>
                                    </div>
                                    <PriceItem
                                        title="Extra Stop Fee"
                                        path="stopFee"
                                        icon={<Car className="h-4 w-4 text-primary/70" />}
                                        form={form}
                                    />
                                    <PriceItem
                                        title="Airport Pickup Fee"
                                        path="airportPickup"
                                        icon={<Plane className="h-4 w-4 text-primary/70" />}
                                        form={form}
                                    />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Child Seats Section */}
                    <Card className="shadow-sm border-muted/60">
                        <CardHeader className="border-b bg-muted/5 pb-4 flex flex-row items-center justify-between space-y-0">
                            <div>
                                <CardTitle className="text-xl font-semibold">Child Seats</CardTitle>
                                <CardDescription className="text-xs">
                                    Manage available child seats and their pricing
                                </CardDescription>
                            </div>
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => append({ name: "", price: 0, isActive: true })}
                                className="flex items-center gap-2"
                            >
                                <Plus className="h-4 w-4" />
                                Add Seat
                            </Button>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="space-y-4">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-start border-b pb-4 last:border-0 last:pb-0">
                                        <div className="md:col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`childSeats.${index}.name`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Seat Name</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="e.g. Baby Seat (0-13kg)" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div>
                                            <FormField
                                                control={form.control}
                                                name={`childSeats.${index}.price`}
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel className="text-xs">Price ({getDashboardCurrencyLabel()})</FormLabel>
                                                        <FormControl>
                                                            <Input type="number" step="0.01" {...field} />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                        <div className="flex items-end justify-between gap-4 h-full pt-8">
                                            <FormField
                                                control={form.control}
                                                name={`childSeats.${index}.isActive`}
                                                render={({ field }) => (
                                                    <div className="flex items-center gap-2">
                                                        <FormControl>
                                                            <Switch checked={field.value} onCheckedChange={field.onChange} />
                                                        </FormControl>
                                                        <span className="text-xs text-muted-foreground">{field.value ? "Active" : "Inactive"}</span>
                                                    </div>
                                                )}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => remove(index)}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                                {fields.length === 0 && (
                                    <div className="text-center py-8 text-muted-foreground italic">
                                        No child seats added. Click "Add Seat" to create one.
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary/60 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Percent className="h-4 w-4 text-primary" />
                                Base Rates
                            </CardTitle>
                            <CardDescription>Global tax and tip rates for all bookings.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="taxRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Standard Tax Rate (%)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" step="0.01" {...field} className="pl-9" />
                                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="gratuityRate"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Mandatory Gratuity (%)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" step="0.01" {...field} className="pl-9" />
                                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <Card className="border-l-4 border-l-primary/60 shadow-sm">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Percent className="h-4 w-4 text-primary" />
                                Marketing Discounts
                            </CardTitle>
                            <CardDescription>Homepage and popup discounts shown on website.</CardDescription>
                        </CardHeader>
                        <CardContent className="pt-4 grid grid-cols-1 md:grid-cols-2 gap-8">
                            <FormField
                                control={form.control}
                                name="discounts.signup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Signup Discount (%)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" step="0.01" {...field} className="pl-9" />
                                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discounts.guest"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guest Discount (%)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" step="0.01" {...field} className="pl-9" />
                                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discounts.returnTrip.signup"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Signup Return Trip Discount (%)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" step="0.01" {...field} className="pl-9" />
                                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="discounts.returnTrip.guest"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Guest Return Trip Discount (%)</FormLabel>
                                        <FormControl>
                                            <div className="relative">
                                                <Input type="number" step="0.01" {...field} className="pl-9" />
                                                <Percent className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                    </Card>

                    <div className="flex justify-end pt-4">
                        <Button type="submit" size="xl" className="px-12 bg-primary hover:bg-primary/90 shadow-md text-primary-foreground font-semibold" disabled={isUpdating}>
                            {isUpdating ? (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                                <CheckCircle2 className="mr-2 h-4 w-4" />
                            )}
                            Save Changes
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
