// /lib/types/api.ts

export type PageResponse<T> = {
    data: T[];
    page: number;
    pageSize: number;
    totalCount: number;
    totalPages: number;
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    searchterm: string | null;
};