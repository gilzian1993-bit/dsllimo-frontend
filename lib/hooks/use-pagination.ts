import { useState, useCallback } from "react";

export interface UsePaginationOptions {
  initialPage?: number;
  initialLimit?: number;
}

export interface PaginationState {
  total: number;
  page: number;
  pages: number;
  limit: number;
}

export interface QueryParams {
  page: number;
  limit: number;
  status?: string;
}

export interface UsePaginationReturn {
  pagination: PaginationState;
  queryParams: QueryParams;
  setPagination: (pagination: Partial<PaginationState>) => void;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  resetPagination: () => void;
}

/**
 * Reusable pagination hook for managing pagination state and query parameters
 * 
 * @param options - Initial pagination options
 * @returns Pagination state, query params, and handlers
 * 
 * @example
 * ```tsx
 * const { pagination, queryParams, handlePageChange, handlePageSizeChange } = usePagination({
 *   initialPage: 1,
 *   initialLimit: 10
 * });
 * ```
 */
export function usePagination(
  options: UsePaginationOptions = {}
): UsePaginationReturn {
  const { initialPage = 1, initialLimit = 10 } = options;

  const [pagination, setPaginationState] = useState<PaginationState>({
    total: 0,
    page: initialPage,
    pages: 1,
    limit: initialLimit,
  });

  const [queryParams, setQueryParams] = useState<QueryParams>({
    page: initialPage,
    limit: initialLimit,
  });

  const setPagination = useCallback((newPagination: Partial<PaginationState>) => {
    setPaginationState((prev) => ({
      ...prev,
      ...newPagination,
    }));
  }, []);

  const handlePageChange = useCallback(
    (page: number) => {
      const newParams = { ...queryParams, page };
      setQueryParams(newParams);
      setPaginationState((prev) => ({ ...prev, page }));
    },
    [queryParams]
  );

  const handlePageSizeChange = useCallback(
    (pageSize: number) => {
      const newParams = { ...queryParams, page: 1, limit: pageSize };
      setQueryParams(newParams);
      setPaginationState((prev) => ({
        ...prev,
        page: 1,
        limit: pageSize,
      }));
    },
    [queryParams]
  );

  const resetPagination = useCallback(() => {
    setPaginationState({
      total: 0,
      page: initialPage,
      pages: 1,
      limit: initialLimit,
    });
    setQueryParams({
      page: initialPage,
      limit: initialLimit,
    });
  }, [initialPage, initialLimit]);

  return {
    pagination,
    queryParams,
    setPagination,
    handlePageChange,
    handlePageSizeChange,
    resetPagination,
  };
}

