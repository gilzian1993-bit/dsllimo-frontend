import { ColumnDef } from "@tanstack/react-table";
import { Pencil, Trash2, CheckCircle2, XCircle } from "lucide-react";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import { HourlyPackage } from "@/lib/types/hourly-package.types";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
    formatDashboardDistance,
    formatDashboardPrice,
    getDistanceUnitLabel,
    getDistanceUnitShortLabel,
} from "@/lib/utils/formatters";

export function getHourlyPricingColumns({
    onEdit,
    onDelete,
    fleets,
}: {
    onEdit?: (pricing: HourlyPackage) => void;
    onDelete?: (pricing: HourlyPackage) => Promise<void>;
    fleets?: any[];
}): ColumnDef<HourlyPackage>[] {
    const columns: ColumnDef<HourlyPackage>[] = [
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
                const fleet = fleets?.find((f) => f._id === (typeof fleetId === 'string' ? fleetId : (fleetId as any)?._id));
                return <div className="font-medium">{fleet?.name || (typeof fleetId === 'string' ? fleetId : (fleetId as any)?.name)}</div>;
            },
        },
        {
            accessorKey: "packageType",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Service Type" />
            ),
            cell: ({ row }) => {
                const type = row.getValue("packageType") as string;
                return (
                    <Badge variant="outline" className="capitalize">
                        {type === 'day' ? 'Full Day' : type}
                    </Badge>
                );
            },
        },
        {
            accessorKey: "duration",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Duration" />
            ),
            cell: ({ row }) => {
                const duration = row.getValue("duration") as number;
                const type = row.original.packageType;
                const unit = type === "hourly" ? "hrs" : type === "day" ? "days" : "weeks";
                return <div>{duration} {unit}</div>;
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
            accessorKey: "includedMiles",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={`Incl. ${getDistanceUnitLabel()}`} />
            ),
            cell: ({ row }) => <div>{formatDashboardDistance(row.getValue("includedMiles"))}</div>,
        },
        {
            accessorKey: "extraMileRate",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title={`Extra /${getDistanceUnitShortLabel()}`} />
            ),
            cell: ({ row }) => (
                <div className="text-muted-foreground">
                    {formatDashboardPrice(row.getValue("extraMileRate"))}
                </div>
            ),
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
