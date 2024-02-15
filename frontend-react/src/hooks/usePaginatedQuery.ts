import { AxiosError } from 'axios';
import { useEffect, useRef } from 'react';
import { QueryKey, UseInfiniteQueryOptions, useInfiniteQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { PaginatedData } from 'src/models/paginated-data';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export type UsePaginatedQueryParams<TData> = {
  url: string;
  queryKey: QueryKey;
  pageSize: number;
  body?: Record<string, unknown>;
  queryParams?: Record<string, unknown>;
  options?: UseInfiniteQueryOptions<PaginatedData<TData>, AxiosError<HttpErrorData>>;
};
export const usePaginatedQuery = <TData>({
  url,
  queryKey,
  pageSize,
  body,
  queryParams,
  options,
}: UsePaginatedQueryParams<TData>) => {
  const isFirstLoadRef = useRef(true);

  useEffect(() => {
    isFirstLoadRef.current = true;
  }, [JSON.stringify(queryKey)]);

  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      const isFirstLoad = isFirstLoadRef.current;
      if (isFirstLoad) {
        isFirstLoadRef.current = false;
      }
      return axios.post<PaginatedData<TData>>(
        url,
        { skip: pageParam, take: pageSize, isFirstLoad, ...body },
        {
          params: queryParams,
        }
      );
    },
    getNextPageParam: (lastPage, pages) => {
      const length = pages.flatMap((x) => x.data).length;
      return length < pages[0].totalCount! ? length : null;
    },
    ...options,
  });

  return query;
};
