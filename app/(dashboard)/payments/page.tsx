"use client";

import React from "react";
import { DataTable } from "@/components/Tables/data-table/data-table";
import { getPaymentColumns } from "@/components/Tables/data-table/columns/payment-columns";
import { usePayments, useDeletePayment, useDeletePayments } from "@/hooks/use-payment";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import type { ExpressPayment } from "@/lib/api/payment";

const PaymentsPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const { data, isLoading, isFetching, error } = usePayments({ page, limit });

    const { mutateAsync: deletePayment } = useDeletePayment();
    const { mutateAsync: deletePayments, isPending: isDeleting } = useDeletePayments();

    const [selectedToDelete, setSelectedToDelete] = React.useState<ExpressPayment[]>([]);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = React.useState(false);

    const columns = getPaymentColumns({
        onView: (payment) => {
            console.log("View details for:", payment);
        },
        onDelete: async (payment) => {
            await deletePayment(payment._id);
        },
    });

    const handleBulkDelete = (selectedRows: ExpressPayment[]) => {
        setSelectedToDelete(selectedRows);
        setIsBulkDeleteDialogOpen(true);
    };

    const confirmBulkDelete = async () => {
        const ids = selectedToDelete.map((row) => row._id);
        await deletePayments(ids);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">Payments History</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        loading={isLoading}
                        fetching={isFetching}
                        error={error?.message}
                        searchKey="customerDetails.email"
                        pagination={data?.meta}
                        onPageChange={setPage}
                        onPageSizeChange={setLimit}
                        onBulkDelete={handleBulkDelete}
                        isDeleting={isDeleting}
                    />
                </CardContent>
            </Card>

            <DeleteConfirmationDialog
                open={isBulkDeleteDialogOpen}
                onClose={() => setIsBulkDeleteDialogOpen(false)}
                onConfirm={confirmBulkDelete}
                title="Confirm Bulk Deletion"
                description={`Are you sure you want to delete ${selectedToDelete.length} selected payments? This action cannot be undone.`}
                toastMessage={`${selectedToDelete.length} payments deleted successfully`}
                defaultToast={false}
            />
        </div>
    );
};

export default PaymentsPage;
