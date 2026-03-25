import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "../data-table-column-header";
import { DashboardUser } from "@/lib/types/user.types";
import { DataTableRowActions } from "../data-table-row-actions";
import { Eye, Trash2 } from "lucide-react";

export const getUserColumns = ({
  onDelete,
}: {
  onDelete?: (user: DashboardUser) => Promise<void>;
} = {}): ColumnDef<DashboardUser>[] => [
  {
    accessorKey: "fullName",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => <span className="font-semibold">{row.original.fullName || "N/A"}</span>,
  },
  {
    accessorKey: "email",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Email" />,
    cell: ({ row }) => <span>{row.original.email || "N/A"}</span>,
  },
  {
    accessorKey: "phone",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Phone" />,
    cell: ({ row }) => <span>{row.original.phone || "N/A"}</span>,
  },
  {
    accessorKey: "state",
    header: ({ column }) => <DataTableColumnHeader column={column} title="State" />,
    cell: ({ row }) => <span>{row.original.state || "N/A"}</span>,
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const status = row.original.status || "inactive";
      const color = status === "active" ? "success" : status === "suspended" ? "destructive" : "secondary";
      return (
        <Badge color={color} variant="soft" className="capitalize font-semibold">
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => {
      const date = row.original.createdAt ? new Date(row.original.createdAt) : null;
      if (!date || Number.isNaN(date.getTime())) return <span>N/A</span>;
      return <span>{format(date, "dd MMM yyyy")}</span>;
    },
  },
  {
    id: "actions",
    header: () => <div className="text-center">Actions</div>,
    cell: ({ row }) => {
      const user = row.original;
      const actions = [
        {
          label: "View Details",
          openModal: true,
          icon: <Eye className="h-4 w-4" />,
        },
        {
          label: "Delete",
          onClick: onDelete ? () => onDelete(user) : undefined,
          icon: <Trash2 className="h-4 w-4" />,
          destructive: true,
          confirm: true,
        },
      ].filter((action) => action.onClick || action.openModal);

      return <DataTableRowActions row={row} actions={actions} />;
    },
  },
];
