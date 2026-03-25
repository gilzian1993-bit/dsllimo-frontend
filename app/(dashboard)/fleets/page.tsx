"use client";

import React from "react";
import { DataTable } from "@/components/Tables/data-table/data-table";
import { getFleetColumns } from "@/components/Tables/data-table/columns/fleet-columns";
import { useFleets, useDeleteFleet, useBulkDeleteFleets, useReorderFleets } from "@/hooks/use-fleet";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AddFleetDialog } from "@/components/Dialogs/add-fleet-dialog";
import { EditFleetDialog } from "@/components/Dialogs/edit-fleet-dialog";
import { FleetTableRow } from "@/lib/types/fleet.types";

const FleetPage = () => {
    const { data, isLoading, isFetching, error } = useFleets();
    const { mutateAsync: deleteFleet } = useDeleteFleet();
    const { mutateAsync: bulkDeleteFleets, isPending: isDeleting } = useBulkDeleteFleets();
    const { mutateAsync: reorderFleets } = useReorderFleets();
    const [editingFleet, setEditingFleet] = React.useState<FleetTableRow | null>(null);
    const [editDialogOpen, setEditDialogOpen] = React.useState(false);
    const columns = getFleetColumns({
        onEdit: (fleet) => {
            setEditingFleet(fleet);
            setEditDialogOpen(true);
        },
        onDelete: async (fleet) => {
            await deleteFleet(fleet._id);
        },
    });

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">Fleets Management</CardTitle>
                    <AddFleetDialog />
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        loading={isLoading}
                        fetching={isFetching}
                        error={error?.message}
                        pagination={data?.meta}
                        searchKey="name"
                        onBulkDelete={async (rows) => {
                            const ids = rows.map((r) => r._id);
                            await bulkDeleteFleets(ids);
                        }}
                        isDeleting={isDeleting}
                        reorderable
                        getRowId={(row) => row._id}
                        onReorder={async (ids) => {
                            await reorderFleets(ids);
                        }}
                    />
                </CardContent>
            </Card>
            <EditFleetDialog
                fleet={editingFleet}
                open={editDialogOpen}
                onOpenChange={setEditDialogOpen}
            />
        </div>
    );
};

export default FleetPage;
