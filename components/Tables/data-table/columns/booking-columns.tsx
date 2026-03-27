import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExpressBooking } from "@/lib/api/booking";
import { format } from "date-fns";

import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import { Trash2, Eye } from "lucide-react";
import { formatDashboardPrice } from "@/lib/utils/formatters";

export function getBookingColumns({
    onDelete,
    onView,
}: {
    onDelete?: (booking: ExpressBooking) => Promise<void>;
    onView?: (booking: ExpressBooking) => void;
}): ColumnDef<ExpressBooking>[] {
    return [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={table.getIsAllPageRowsSelected()}
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "bookingNumber",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Booking ID" />
            ),
            cell: ({ row }) => (
                <span className="font-mono text-sm font-bold">
                    {row.original.bookingNumber || "N/A"}
                </span>
            ),
        },
        {
            id: "customer",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Customer" />
            ),
            accessorFn: (row) => {
                const legacyContact = (row as any)?.contact;
                const fullName =
                    row.passengerDetails?.fullName ||
                    legacyContact?.firstName ||
                    "N/A";
                const email =
                    row.passengerDetails?.email ||
                    legacyContact?.email ||
                    "";
                return `${fullName} ${email}`.trim();
            },
            cell: ({ row }) => {
                const legacyContact = (row.original as any)?.contact;
                const fullName =
                    row.original.passengerDetails?.fullName ||
                    legacyContact?.firstName ||
                    "N/A";
                const email =
                    row.original.passengerDetails?.email ||
                    legacyContact?.email ||
                    "N/A";
                return (
                    <div className="flex flex-col">
                        <span className="font-bold">{fullName}</span>
                        <span className="text-xs text-muted-foreground">{email}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "tripDetails.pickupAddress",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Pickup" />
            ),
            cell: ({ row }) => {
                const legacyPickup = (row.original as any)?.pickup?.address;
                const pickupAddress = row.original.tripDetails?.pickupAddress || legacyPickup || "N/A";
                return (
                    <div className="max-w-[180px] truncate flex flex-col" title={pickupAddress}>
                        <span className="truncate">{pickupAddress}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "tripDetails.deliveryAddress",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Delivery" />
            ),
            cell: ({ row }) => {
                const legacyDelivery = (row.original as any)?.delivery?.address;
                const deliveryAddress = row.original.tripDetails?.deliveryAddress || legacyDelivery || "N/A";
                return (
                    <div className="max-w-[180px] truncate flex flex-col" title={deliveryAddress}>
                        <span className="truncate">{deliveryAddress}</span>
                    </div>
                );
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
            ),
            cell: ({ row }) => {
                return <span className="font-bold">{formatDashboardPrice(row.original.amount || 0)}</span>;
            },
        },
        {
            accessorKey: "vehicle",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Vehicle" />
            ),
            cell: ({ row }) => {
                const vehicle = row.original.vehicle;
                const vehicleName = typeof vehicle === "string"
                    ? vehicle.replace(/_/g, " ")
                    : vehicle?.name || "N/A";
                return (
                    <Badge color="secondary" variant="soft" className="font-semibold capitalize truncate max-w-[100px]">
                        {vehicleName}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = row.original.status || "pending";
                let color: "default" | "destructive" | "success" | "info" | "warning" | "dark" | "secondary" = "secondary";
                let variant: "outline" | "soft" | undefined = undefined;

                if (status === "completed" || status === "confirmed") color = "success";
                if (status === "cancelled") color = "destructive";
                if (status === "pending") {
                    color = "secondary";
                    variant = "outline";
                }

                return (
                    <Badge color={color} variant={variant || "soft"} className="capitalize font-bold">
                        {status}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "createdAt",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Date" />
            ),
            cell: ({ row }) => {
                const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
                if (!date || Number.isNaN(date.getTime())) return <span>N/A</span>;
                return <span>{format(date, "dd MMM yyyy HH:mm")}</span>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const booking = row.original;

                const actions = [
                    {
                        label: "View",
                        onClick: onView ? () => onView(booking) : undefined,
                        icon: <Eye className="h-4 w-4" />,
                    },
                    {
                        label: "Delete",
                        onClick: onDelete ? () => onDelete(booking) : undefined,
                        icon: <Trash2 className="h-4 w-4" />,
                        destructive: true,
                        confirm: true,
                    },
                ].filter((action) => action.onClick);

                return <DataTableRowActions row={row} actions={actions} />;
            },
        },
    ];
}
