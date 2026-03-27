"use client";

import React from "react";
import { DataTable } from "@/components/Tables/data-table/data-table";
import { getBookingColumns } from "@/components/Tables/data-table/columns/booking-columns";
import { useBookings, useDeleteBooking, useDeleteBookings } from "@/hooks/use-booking";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DeleteConfirmationDialog from "@/components/delete-confirmation-dialog";
import type { ExpressBooking } from "@/lib/api/booking";
import { useRouter } from "next/navigation";

const BookingsPage = () => {
    const [page, setPage] = React.useState(1);
    const [limit, setLimit] = React.useState(10);
    const { data, isLoading, isFetching, error } = useBookings({ page, limit });

    const { mutateAsync: deleteBooking } = useDeleteBooking();
    const { mutateAsync: deleteBookings, isPending: isDeleting } = useDeleteBookings();
    const router = useRouter();

    const [selectedToDelete, setSelectedToDelete] = React.useState<ExpressBooking[]>([]);
    const [isBulkDeleteDialogOpen, setIsBulkDeleteDialogOpen] = React.useState(false);

    const columns = getBookingColumns({
        onDelete: async (booking) => {
            await deleteBooking(booking._id);
        },
        onView: (booking) => {
            router.push(`/bookings/${booking._id}`);
        },
    });

    const handleBulkDelete = (selectedRows: ExpressBooking[]) => {
        setSelectedToDelete(selectedRows);
        setIsBulkDeleteDialogOpen(true);
    };

    const confirmBulkDelete = async () => {
        const ids = selectedToDelete.map((row) => row._id);
        await deleteBookings(ids);
    };

    return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                    <CardTitle className="text-2xl font-bold">Bookings Management</CardTitle>
                </CardHeader>
                <CardContent>
                    <DataTable
                        columns={columns}
                        data={data?.data || []}
                        loading={isLoading}
                        fetching={isFetching}
                        error={error?.message}
                        searchKey="passengerDetails.email"
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
                description={`Are you sure you want to delete ${selectedToDelete.length} selected bookings? This action cannot be undone.`}
                toastMessage={`${selectedToDelete.length} bookings deleted successfully`}
                defaultToast={false}
            />
        </div>
    );
};

export default BookingsPage;
