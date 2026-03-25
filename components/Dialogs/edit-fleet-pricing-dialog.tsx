"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FleetPricingForm } from "../Forms/fleet-pricing-form";
import { useUpdateFleetPricing } from "@/hooks/use-fleet-pricing";
import { FleetPricing } from "@/lib/api/fleet-pricing";

interface EditFleetPricingDialogProps {
    pricing: FleetPricing | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditFleetPricingDialog = ({
    pricing,
    open,
    onOpenChange,
}: EditFleetPricingDialogProps) => {
    const { mutateAsync: updatePricing, isPending } = useUpdateFleetPricing();

    const handleSubmit = async (data: any) => {
        if (pricing) {
            await updatePricing({ id: pricing._id, data });
            onOpenChange(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Fleet Pricing</DialogTitle>
                </DialogHeader>
                {pricing && (
                    <FleetPricingForm
                        onSubmit={handleSubmit}
                        initialData={pricing}
                        isLoading={isPending}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
};
