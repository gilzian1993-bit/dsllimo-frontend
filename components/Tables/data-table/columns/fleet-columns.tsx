"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
    Pencil,
    Trash2,
    CheckCircle2,
    XCircle,
} from "lucide-react";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DataTableRowActions } from "../data-table-row-actions";
import type { FleetTableRow } from "@/lib/types/fleet.types";
import { Checkbox } from "@/components/ui/checkbox";

export function getFleetColumns({
    onEdit,
    onDelete,
}: {
    onEdit?: (fleet: FleetTableRow) => void;
    onDelete?: (fleet: FleetTableRow) => Promise<void>;
}): ColumnDef<FleetTableRow>[] {
    const columns: ColumnDef<FleetTableRow>[] = [
        {
            id: "select",
            header: ({ table }) => (
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-[2px]"
                />
            ),
            cell: ({ row }) => (
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-[2px]"
                />
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Fleet Name" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="font-medium whitespace-nowrap">{row.getValue("name")}</div>
                );
            },
        },
        {
            accessorKey: "carType",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Car Type" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-sm capitalize">{row.getValue("carType") || "-"}</div>
                );
            },
        },
        {
            accessorKey: "passengers",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Passengers" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-sm">{row.getValue("passengers")}</div>
                );
            },
        },
        {
            accessorKey: "suitcases",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Suitcases" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-sm">{row.getValue("suitcases")}</div>
                );
            },
        },
        {
            accessorKey: "timePeriod",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Time Period" />
            ),
            cell: ({ row }) => {
                return (
                    <div className="text-sm">{(row.getValue("timePeriod") as string) || "-"}</div>
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
            accessorKey: "allowRequestQuote",
            header: ({ column }) => (
                <DataTableColumnHeader column={column} title="Request Quote" />
            ),
            cell: ({ row }) => {
                const allowRequestQuote = row.getValue("allowRequestQuote") as boolean;
                return (
                    <div className="flex items-center gap-2">
                        {allowRequestQuote ? (
                            <>
                                <CheckCircle2 className="h-4 w-4 text-green-600" />
                                <span className="text-xs font-medium text-green-600">Enabled</span>
                            </>
                        ) : (
                            <>
                                <XCircle className="h-4 w-4 text-gray-500" />
                                <span className="text-xs font-medium text-gray-500">Disabled</span>
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
                const fleet = row.original;

                const actions = [
                    {
                        label: "Edit",
                        onClick: () => onEdit?.(fleet),
                        icon: <Pencil className="h-4 w-4" />,
                    },
                    {
                        label: "Delete",
                        onClick: onDelete ? () => onDelete(fleet) : undefined,
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
