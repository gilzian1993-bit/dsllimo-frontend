"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { HourlyPricingForm } from "../Forms/hourly-pricing-form";
import { useCreateHourlyPricing } from "@/hooks/use-hourly-pricing";

export const AddHourlyPricingDialog = ({ defaultFleetId }: { defaultFleetId?: string }) => {
    const [open, setOpen] = React.useState(false);
    const { mutateAsync: createPricing, isPending } = useCreateHourlyPricing();

    const handleSubmit = async (data: any) => {
        await createPricing(data);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Hourly Transfer
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Hourly Package</DialogTitle>
                </DialogHeader>
                <HourlyPricingForm
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                    initialData={defaultFleetId ? { fleetId: defaultFleetId } : undefined}
                />
            </DialogContent>
        </Dialog>
    );
};
