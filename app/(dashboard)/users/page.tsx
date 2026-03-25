"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/components/Tables/data-table/data-table";
import { getUserColumns } from "@/components/Tables/data-table/columns/user-columns";
import { useDeleteUser, useUsers } from "@/hooks/use-user";

const UsersPage = () => {
  const [page, setPage] = React.useState(1);
  const [limit, setLimit] = React.useState(10);
  const { mutateAsync: deleteUser } = useDeleteUser();

  const { data, isLoading, isFetching, error } = useUsers({
    page,
    limit,
  });
  const columns = getUserColumns({
    onDelete: async (user) => {
      await deleteUser(user._id);
    },
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-2xl font-bold">Users Management</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data?.data || []}
            loading={isLoading}
            fetching={isFetching}
            error={error instanceof Error ? error.message : null}
            searchKey="email"
            pagination={data?.meta}
            onPageChange={setPage}
            onPageSizeChange={setLimit}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default UsersPage;
