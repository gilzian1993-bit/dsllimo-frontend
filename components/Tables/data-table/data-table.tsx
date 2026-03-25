"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";
import { Loader2, GripVertical } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey?: string;
  filterColumns?: {
    column: string;
    title: string;
    multiple: boolean;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  loading?: boolean;
  fetching?: boolean;
  error?: string | null;
  pagination?: {
    total: number;
    page: number;
    pages: number;
    limit: number;
  };
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onBulkDelete?: (selectedRows: TData[]) => void;
  isDeleting?: boolean;
  reorderable?: boolean;
  getRowId?: (row: TData) => string;
  onReorder?: (orderedIds: string[]) => void;
}

function SortableTableRow<TData, TValue>({
  id,
  row,
  columns,
  reorderable,
}: {
  id: string;
  row: ReturnType<ReturnType<typeof useReactTable<TData>>["getRowModel"]>["rows"][0];
  columns: ColumnDef<TData, TValue>[];
  reorderable: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      data-state={(row.getIsSelected() && "selected") || (isDragging ? "dragging" : undefined)}
      className={isDragging ? "opacity-50 bg-muted/50" : undefined}
    >
      {reorderable && (
        <TableCell className="w-10 cursor-grab active:cursor-grabbing p-2" {...attributes} {...listeners}>
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </TableCell>
      )}
      {row.getVisibleCells().map((cell) => (
        <TableCell key={cell.id}>
          {flexRender(cell.column.columnDef.cell, cell.getContext())}
        </TableCell>
      ))}
    </TableRow>
  );
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  filterColumns = [],
  loading = false,
  fetching = false,
  error = null,
  pagination,
  onPageChange,
  onPageSizeChange,
  onBulkDelete,
  isDeleting = false,
  reorderable = false,
  getRowId,
  onReorder,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = React.useState<SortingState>([]);

  // Reset row selection when data changes to prevent state updates during render
  React.useEffect(() => {
    setRowSelection({});
  }, [data]);

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    pageCount: pagination?.pages ?? 1,
    enableRowSelection: true,
    autoResetPageIndex: false,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  });

  const handlePageChange = (page: number) => {
    onPageChange?.(page);
  };
  const handlePageSizeChange = (pageSize: number) => {
    onPageSizeChange?.(pageSize);
  };

  const rowIds = React.useMemo(() => {
    if (!reorderable || !getRowId) return [];
    return table.getRowModel().rows.map((row) => getRowId(row.original));
  }, [reorderable, getRowId, table.getRowModel().rows]);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !onReorder || !getRowId) return;
    const oldIndex = rowIds.indexOf(String(active.id));
    const newIndex = rowIds.indexOf(String(over.id));
    if (oldIndex === -1 || newIndex === -1) return;
    const newOrder = arrayMove(rowIds, oldIndex, newIndex);
    onReorder(newOrder);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  const colSpan = columns.length + (reorderable ? 1 : 0);

  const tableBodyContent = loading ? (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex flex-col items-center justify-center py-10 text-muted-foreground">
          <Loader2 className="mb-2 h-5 w-5 animate-spin" />
          Loading data...
        </div>
      </TableCell>
    </TableRow>
  ) : error ? (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex items-center justify-center py-10 text-red-500 font-medium">
          {error}
        </div>
      </TableCell>
    </TableRow>
  ) : table.getRowModel().rows?.length ? (
    reorderable && getRowId && onReorder ? (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={rowIds} strategy={verticalListSortingStrategy}>
          {table.getRowModel().rows.map((row) => (
            <SortableTableRow
              key={getRowId(row.original)}
              id={getRowId(row.original)}
              row={row}
              columns={columns}
              reorderable={reorderable}
            />
          ))}
        </SortableContext>
      </DndContext>
    ) : (
      table.getRowModel().rows.map((row) => (
        <TableRow
          key={row.id}
          data-state={row.getIsSelected() && "selected"}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell key={cell.id}>
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))
    )
  ) : (
    <TableRow>
      <TableCell colSpan={colSpan}>
        <div className="flex items-center justify-center py-10 text-muted-foreground">
          No results found.
        </div>
      </TableCell>
    </TableRow>
  );

  return (
    <div className="space-y-4">
      <DataTableToolbar
        table={table}
        searchKey={searchKey}
        filterColumns={filterColumns}
        onBulkDelete={onBulkDelete}
        isDeleting={isDeleting}
      />

      <div className="relative rounded-md border overflow-hidden">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {reorderable && <TableHead className="w-10" />}
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} colSpan={header.colSpan}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {tableBodyContent}
          </TableBody>
        </Table>
        <AnimatePresence>
          {fetching && !loading && (
            <motion.div
              key="overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 flex items-center justify-center
                         bg-white/60 dark:bg-black/40 backdrop-blur-[1px]"
            >
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <DataTablePagination
        table={table}
        totalRows={pagination?.total}
        loading={loading}
        fetching={fetching}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        currentPage={pagination?.page ?? 1}
        totalPages={pagination?.pages ?? 1}
      />
    </div>
  );
}
