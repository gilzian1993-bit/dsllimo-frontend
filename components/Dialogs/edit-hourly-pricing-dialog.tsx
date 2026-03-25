"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { HourlyPricingForm } from "../Forms/hourly-pricing-form";
import { useUpdateHourlyPricing } from "@/hooks/use-hourly-pricing";
import { HourlyPackage } from "@/lib/types/hourly-package.types";

interface EditHourlyPricingDialogProps {
    pricing: HourlyPackage | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditHourlyPricingDialog = ({
    pricing,
    open,
    onOpenChange,
}: EditHourlyPricingDialogProps) => {
    const { mutateAsync: updatePricing, isPending } = useUpdateHourlyPricing();

    const handleSubmit = async (data: any) => {
        if (!pricing) return;
        await updatePricing({ id: pricing._id, data });
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Hourly Transfer</DialogTitle>
                </DialogHeader>
                {pricing && (
                    <HourlyPricingForm
                        onSubmit={handleSubmit}
                        isLoading={isPending}
                        initialData={pricing as any}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
