"use client";
import { X, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTableViewOptions } from "./data-table-view-options";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { Table } from "@tanstack/react-table";

interface DataTableToolbarProps {
  table: Table<any>;
  searchKey?: string;
  filterColumns?: {
    multiple: boolean;
    column: string;
    title: string;
    options: { label: string; value: string; icon?: React.ComponentType<{ className?: string }> }[];
  }[];
  onBulkDelete?: (selectedRows: any[]) => void;
  isDeleting?: boolean;
}

export function DataTableToolbar({ 
  table, 
  searchKey, 
  filterColumns = [], 
  onBulkDelete,
  isDeleting = false,
}: DataTableToolbarProps) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const selectedRows = table.getFilteredSelectedRowModel().rows;
  const hasSelectedRows = selectedRows.length > 0;
  
  const handleFilterChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(value);
    }
  };

  const handleBulkDelete = () => {
    if (onBulkDelete && hasSelectedRows) {
      onBulkDelete(selectedRows.map(row => row.original));
    }
  };

  return (
    <div className="flex flex-1 flex-wrap items-center gap-2">
      {searchKey && (
        <Input
          placeholder={`Filter by ${searchKey}...`}
          value={table.getColumn(searchKey)?.getFilterValue() as string || ""}
          onChange={handleFilterChange}
          className="h-10 min-w-[200px] max-w-sm"
        />
      )}

      {filterColumns.map((filter) => {
        const column = table.getColumn(filter.column);
        return column ? (
          <DataTableFacetedFilter
            key={filter.column}
            column={column}
            title={filter.title}
            options={filter.options}
            multiple={filter.multiple ?? false}
          />
        ) : null;
      })}
      {isFiltered && (
        <Button
          variant="outline"
          onClick={() => table.resetColumnFilters()}
          className="h-10 px-2 lg:px-3"
        >
          Reset
          <X className="ltr:ml-2 rtl:mr-2 h-4 w-4" />
        </Button>
      )}
      
      {hasSelectedRows && onBulkDelete && (
        <Button
          color="destructive"
          onClick={handleBulkDelete}
          disabled={isDeleting}
          className="h-10 px-3"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete {selectedRows.length} selected
        </Button>
      )}
      
      <DataTableViewOptions table={table} />
    </div>
  );
}