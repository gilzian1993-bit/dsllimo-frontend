"use client";

import React from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { FleetForm } from "../Forms/fleet-form";
import { useUpdateFleet } from "@/hooks/use-fleet";
import { FleetTableRow } from "@/lib/types/fleet.types";

interface EditFleetDialogProps {
    fleet: FleetTableRow | null;
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export const EditFleetDialog = ({ fleet, open, onOpenChange }: EditFleetDialogProps) => {
    const { mutateAsync: updateFleet, isPending } = useUpdateFleet();

    if (!fleet) return null;

    const handleSubmit = async (data: any) => {
        await updateFleet({ id: fleet._id, data });
        onOpenChange(false);
    };


    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Fleet: {fleet.name}</DialogTitle>
                </DialogHeader>
                <FleetForm
                    onSubmit={handleSubmit}
                    isLoading={isPending}
                    initialData={{
                        name: fleet.name,
                        description: fleet.description,
                        image: fleet.image,
                        passengers: fleet.passengers,
                        suitcases: fleet.suitcases,
                        timePeriod: fleet.timePeriod,
                        carType: fleet.carType,
                        isActive: fleet.isActive,
                        allowRequestQuote: fleet.allowRequestQuote,
                    }}
                />
            </DialogContent>
        </Dialog>
    );
};
