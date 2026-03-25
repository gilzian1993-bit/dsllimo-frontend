"use client";

import React from "react";
import { useParams } from "next/navigation";
import { DataTable } from "@/components/Tables/data-table/data-table";
import { getFleetPricingColumns } from "@/components/Tables/data-table/columns/fleet-pricing-columns";
import { getHourlyPricingColumns } from "@/components/Tables/data-table/columns/hourly-pricing-columns";
import { useFleetPricings, useDeleteFleetPricing, useDeleteFleetPricings } from "@/hooks/use-fleet-pricing";
import { useHourlyPricings, useDeleteHourlyPricing, useDeleteHourlyPricings } from "@/hooks/use-hourly-pricing";
import { useFleets } from "@/hooks/use-fleet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFleetPricingDialog } from "@/components/Dialogs/add-fleet-pricing-dialog";
import { EditFleetPricingDialog } from "@/components/Dialogs/edit-fleet-pricing-dialog";
import { AddHourlyPricingDialog } from "@/components/Dialogs/add-hourly-pricing-dialog";
import { EditHourlyPricingDialog } from "@/components/Dialogs/edit-hourly-pricing-dialog";
import { FleetPricing } from "@/lib/api/fleet-pricing";
import { HourlyPackage } from "@/lib/types/hourly-package.types";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FleetPricingDetailsPage = () => {
    const params = useParams();
    const fleetId = params.id as string;

    // Distance Pricing State
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const { data: pricingsData, isLoading, isFetching, error } = useFleetPricings({ fleetId, page, limit });

    // Hourly Pricing State
    const [hourlyPage, setHourlyPage] = React.useState(1);
    const [hourlyLimit, setHourlyLimit] = React.useState(10);
    const { data: hourlyData, isLoading: isHourlyLoading, isFetching: isHourlyFetching } = useHourlyPricings({ fleetId, page: hourlyPage, limit: hourlyLimit });

    const { data: fleetsData } = useFleets();

    // Delete hooks
    const { mutateAsync: deletePricing } = useDeleteFleetPricing();
    const { mutateAsync: deletePricings, isPending: isDeleting } = useDeleteFleetPricings();

    const { mutateAsync: deleteHourly } = useDeleteHourlyPricing();
    const { mutateAsync: deleteHourlies, isPending: isDeletingHourly } = useDeleteHourlyPricings();

    // Dialog states
    const [editingPricing, setEditingPricing] = React.useState<FleetPricing | null>(null);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);

    const [editingHourly, setEditingHourly] = React.useState<HourlyPackage | null>(null);
    const [editHourlyDialogOpen, setEditHourlyDialogOpen] = React.useState(false);

    const [selectedToDelete, setSelectedToDelete] = React.useState<any[]>([]);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = React.useState(false);
    const [bulkDeleteType, setBulkDeleteType] = React.useState<"distance" | "hourly">("distance");

    const currentFleet = fleetsData?.data?.find((f: any) => f._id === fleetId);

    const distanceColumns = getFleetPricingColumns({
        onEdit: (pricing) => {
            setEditingPricing(pricing);
            setEditDialogOpen(true);
        },
        onDelete: async (pricing) => {
            await deletePricing(pricing._id);
        },
        fleets: fleetsData?.data || [],
    });

    const hourlyColumns = getHourlyPricingColumns({
        onEdit: (pricing) => {
            setEditingHourly(pricing);
            setEditHourlyDialogOpen(true);
        },
        onDelete: async (pricing) => {
            await deleteHourly(pricing._id);
        },
        fleets: fleetsData?.data || [],
    });

    const handleBulkDelete = (selectedRows: any[], type: "distance" | "hourly") => {
        setSelectedToDelete(selectedRows);
        setBulkDeleteType(type);
        setIsBulkDeleteDialogOpen(true);
    };

    const confirmBulkDelete = async () => {
        const ids = selectedToDelete.map((row) => row._id);
        if (bulkDeleteType === "distance") {
            await deletePricings(ids);
        } else {
            await deleteHourlies(ids);
        }
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">
                        Pricing for: {currentFleet?.name || "Loading..."}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="distance" className="w-full">
                        <TabsList className="mb-4">
                            <TabsTrigger value="distance">Distance Based (Transfers)</TabsTrigger>
                            <TabsTrigger value="hourly">Hourly Transfers</TabsTrigger>
                        </TabsList>

                        <TabsContent value="distance" className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Distance Ranges</h3>
                                <AddFleetPricingDialog defaultFleetId={fleetId} />
                            </div>
                            <DataTable
                                columns={distanceColumns}
                                data={pricingsData?.data || []}
                                loading={isLoading}
                                fetching={isFetching}
                                error={error?.message}
                                pagination={{
                                    total: pricingsData?.meta?.total || 0,
                                    page: pricingsData?.meta?.page || 1,
                                    pages: pricingsData?.meta?.pages || 0,
                                    limit: pricingsData?.meta?.limit || 10
                                }}
                                onPageChange={setPage}
                                onPageSizeChange={setLimit}
                                onBulkDelete={(rows) => handleBulkDelete(rows, "distance")}
                                isDeleting={isDeleting}
                                searchKey="type"
                            />
                        </TabsContent>

                        <TabsContent value="hourly" className="space-y-4">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-medium">Hourly / Daily / Weekly Service Types</h3>
                                <AddHourlyPricingDialog defaultFleetId={fleetId} />
                            </div>
                            <DataTable
                                columns={hourlyColumns}
                                data={hourlyData?.packages || []}
                                loading={isHourlyLoading}
                                fetching={isHourlyFetching}
                                pagination={{
                                    total: hourlyData?.total || 0,
                                    page: hourlyData?.page || 1,
                                    pages: hourlyData?.pages || 0,
                                    limit: hourlyLimit
                                }}
                                onPageChange={setHourlyPage}
                                onPageSizeChange={setHourlyLimit}
                                onBulkDelete={(rows) => handleBulkDelete(rows, "hourly")}
                                isDeleting={isDeletingHourly}
                                searchKey="packageType"
                            />
                        </TabsContent>
                    </Tabs>
                </CardContent>
            </Card>

            <EditFleetPricingDialog
                pricing={editingPricing}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />

            <EditHourlyPricingDialog
                pricing={editingHourly}
                open={editHourlyDialogOpen}
                onOpenChange={setEditHourlyDialogOpen}
            />

            <DeleteConfirmationDialog
                open={isBulkDeleteDialogOpen}
                onClose={() => setIsBulkDeleteDialogOpen(false)}
                onConfirm={confirmBulkDelete}
                title="Confirm Bulk Deletion"
                description={`Are you sure you want to delete ${selectedToDelete.length} selected pricing records? This action cannot be undone.`}
                toastMessage={`${selectedToDelete.length} pricing records deleted successfully`}
                defaultToast={false}
            />
        </div>
    );
};

export default FleetPricingDetailsPage;
