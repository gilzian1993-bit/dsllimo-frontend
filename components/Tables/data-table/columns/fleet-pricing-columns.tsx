import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import { FleetPricing } from "@/lib/api/fleet-pricing";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    formatDashboardDistance,
    formatDashboardPrice,
    getDistanceUnitShortLabel,
} from "@/lib/utils/formatters";

export function getFleetPricingColumns({
    onEdit,
    onDelete,
    fleets,
}: {
    onEdit?: (pricing: FleetPricing) => void;
    onDelete?: (pricing: FleetPricing) => Promise<void>;
    fleets?: any[];
}): ColumnDef<FleetPricing>[] {
    const columns: ColumnDef<FleetPricing>[] = [
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
            accessorKey: "fleetId",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Fleet" />
            ),
            cell: ({ row }) => {
                const fleetId = row.getValue("fleetId") as string;
                const fleet = fleets?.find((f) => f._id === fleetId);
                return <div className="font-medium">{fleet?.name || fleetId}</div>;
            },
        },
        {
            accessorKey: "minDistance",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={`Min Distance (${getDistanceUnitShortLabel()})`} />
            ),
            cell: ({ row }) => <div>{formatDashboardDistance(row.getValue("minDistance"))}</div>,
        },
        {
            accessorKey: "maxDistance",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={`Max Distance (${getDistanceUnitShortLabel()})`} />
            ),
            cell: ({ row }) => {
                const max = row.getValue("maxDistance");
                return <div>{max === null ? "∞" : formatDashboardDistance(max)}</div>;
            },
        },
        {
            accessorKey: "price",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Price" />
            ),
            cell: ({ row }) => (
                <div className="font-semibold text-primary">
                    {formatDashboardPrice(row.getValue("price"))}
                </div>
            ),
        },
        {
            accessorKey: "increasePercentage",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Increase %" />
            ),
            cell: ({ row }) => {
                const increasePercentage = Number(row.getValue("increasePercentage") ?? 0);
                return <div className="font-medium">{increasePercentage.toFixed(2)}%</div>;
            },
        },
        {
            accessorKey: "type",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Type" />
            ),
            cell: ({ row }) => {
                const type = row.getValue("type") as string;
                return (
                    <Badge color={type === "fixed" ? "default" : "secondary"}>
                        {type === "fixed" ? "Fixed" : "Per Mile"}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "isActive",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Status" />
            ),
            cell: ({ row }) => {
                const isActive = row.getValue("isActive") as boolean;
                return (
                    <div className="flex items-center gap-2">
                        {isActive ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-xs text-green-600 font-medium">Active</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-xs text-red-600 font-medium">Inactive</span>
                            </>
                        )}
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => <div className="text-center">Actions</div>,
            cell: ({ row }) => {
                const pricing = row.original;

                const actions = [
                    {
                        label: "Edit",
                        onClick: () => onEdit?.(pricing),
                        icon: <Pencil className="h-4 w-4" />,
                    },
                    {
                        label: "Delete",
                        onClick: onDelete ? () => onDelete(pricing) : undefined,
                        icon: <Trash2 className="h-4 w-4" />,
                        destructive: true,
                        confirm: true,
                    },
                ].filter((action) => action.onClick);

                return <DataTableRowActions row={row} actions={actions} />;
            },
        },
    ];

    return columns;
}
