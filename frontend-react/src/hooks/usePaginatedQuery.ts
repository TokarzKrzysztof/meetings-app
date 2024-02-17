import { AxiosError } from 'axios';
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
  const query = useInfiniteQuery({
    queryKey,
    queryFn: ({ pageParam }) => {
      return axios.post<PaginatedData<TData>>(
        url,
        { skip: pageParam, take: pageSize, ...body },
        {
          params: queryParams,
        }
      );
    },
    
    getNextPageParam: (lastPage, pages) => {
      const length = pages.flatMap((x) => x.data).length;
      const nextSkip = (pages.indexOf(lastPage) + 1) * pageSize;

      // must return undefined instead of null because it will mean that there is no next page anymore
      return length < pages[0].totalCount! ? nextSkip : undefined;
    },
    ...options,
  });

  return query;
};
