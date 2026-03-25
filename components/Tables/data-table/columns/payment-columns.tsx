import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ExpressPayment } from "@/lib/api/payment";
import { format } from "date-fns";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import { Eye, Trash2 } from "lucide-react";
import { formatDashboardPrice } from "@/lib/utils/formatters";

export function getPaymentColumns({
    onView,
    onDelete,
}: {
    onView?: (payment: ExpressPayment) => void;
    onDelete?: (payment: ExpressPayment) => Promise<void>;
}): ColumnDef<ExpressPayment>[] {
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
            accessorKey: "transactionId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Transaction ID" />
            ),
            cell: ({ row }) => (
                <span className="font-mono text-sm font-bold">
                    {row.original.transactionId}
                </span>
            ),
        },
        {
            id: "customer",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Customer" />
            ),
            cell: ({ row }) => {
                const customer = row.original.customerDetails;
                return (
                    <div className="flex flex-col">
                        <span className="font-bold">{customer.name}</span>
                        <span className="text-xs text-muted-foreground">{customer.email}</span>
                    </div>
                );
            },
        },
        {
            id: "method",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Method" />
            ),
            cell: ({ row }) => {
                const method = row.original.paymentMethodType;
                return (
                    <span className="capitalize text-sm font-medium">{method || "N/A"}</span>
                );
            },
        },
        {
            id: "card",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Card" />
            ),
            cell: ({ row }) => {
                const last4 = row.original.cardLast4;
                return (
                    <span className="text-sm font-mono">{last4 ? `•••• ${last4}` : "—"}</span>
                );
            },
        },
        {
            accessorKey: "amount",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Amount" />
            ),
            cell: ({ row }) => {
                return (
                    <span className="font-bold">
                        {formatDashboardPrice(row.original.amount)}
                    </span>
                );
            },
        },
        {
            accessorKey: "status",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const status = row.original.status;
                let color: "default" | "destructive" | "success" | "info" | "warning" | "dark" | "secondary" = "secondary";

                if (status === 'completed') color = "success";
                if (status === 'failed') color = "destructive";
                if (status === 'pending') color = "warning";
                if (status === 'refunded') color = "info";

                return (
                    <Badge color={color} variant="soft" className="capitalize font-bold">
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
                return <span>{format(new Date(row.original.createdAt), "dd MMM yyyy HH:mm")}</span>;
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const payment = row.original;

                const actions = [
                    {
                        label: "View Details",
                        onClick: () => onView?.(payment),
                        icon: <Eye className="h-4 w-4" />,
                    },
                    {
                        label: "Delete",
                        onClick: onDelete ? () => onDelete(payment) : undefined,
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
