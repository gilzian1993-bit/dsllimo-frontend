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
import { FleetPricingForm } from "../Forms/fleet-pricing-form";
import { useCreateFleetPricing } from "@/hooks/use-fleet-pricing";

export const AddFleetPricingDialog = ({ defaultFleetId }: { defaultFleetId?: string }) => {
    const [open, setOpen] = React.useState(false);
    const { mutateAsync: createPricing, isPending } = useCreateFleetPricing();

    const handleSubmit = async (data: any) => {
        await createPricing(data);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Pricing
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Fleet Pricing</DialogTitle>
                </DialogHeader>
                <FleetPricingForm
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                    initialData={defaultFleetId ? { fleetId: defaultFleetId } : undefined}
                />
            </DialogContent>
        </Dialog>
    );
};
