"use client";

import React from "react";
import { DataTable } from "@/components/Tables/data-table/data-table";
import { getFleetPricingColumns } from "@/components/Tables/data-table/columns/fleet-pricing-columns";
import { useFleetPricings, useDeleteFleetPricing } from "@/hooks/use-fleet-pricing";
import { useFleets } from "@/hooks/use-fleet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFleetPricingDialog } from "@/components/Dialogs/add-fleet-pricing-dialog";
import { EditFleetPricingDialog } from "@/components/Dialogs/edit-fleet-pricing-dialog";
import { FleetPricing } from "@/lib/api/fleet-pricing";

const FleetPricingPage = () => {
    const { data: pricingsData, isLoading, isFetching, error } = useFleetPricings();
    const { data: fleetsData } = useFleets();
    const { mutateAsync: deletePricing } = useDeleteFleetPricing();

    const [editingPricing, setEditingPricing] = React.useState<FleetPricing | null>(null);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);

    const columns = getFleetPricingColumns({
        onEdit: (pricing) => {
            setEditingPricing(pricing);
            setEditDialogOpen(true);
        },
        onDelete: async (pricing) => {
            await deletePricing(pricing._id);
        },
        fleets: fleetsData?.data || [],
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">Fleet Pricing Management</CardTitle>
                    <AddFleetPricingDialog />
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={pricingsData?.data || []}
                        loading={isLoading}
                        fetching={isFetching}
                        error={error?.message}
                        pagination={{
                            total: pricingsData?.meta.total || 0,
                            page: pricingsData?.meta.page || 1,
                            pages: pricingsData?.meta.totalPages || 0,
                            limit: pricingsData?.meta.limit || 10
                        }}
                        searchKey="fleetId"
                    />
                </CardContent>
            </Card>

            <EditFleetPricingDialog
                pricing={editingPricing}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </div>
    );
};

export default FleetPricingPage;
