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
import { FleetForm } from "../Forms/fleet-form";
import { useCreateFleet } from "@/hooks/use-fleet";

export const AddFleetDialog = () => {
    const [open, setOpen] = React.useState(false);
    const { mutateAsync: createFleet, isPending } = useCreateFleet();

    const handleSubmit = async (data: any) => {
        await createFleet(data);
        setOpen(false);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Fleet
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Add New Fleet</DialogTitle>
                </DialogHeader>
                <FleetForm onSubmit={handleSubmit} isLoading={isPending} />
            </DialogContent>
        </Dialog>
    );
};
