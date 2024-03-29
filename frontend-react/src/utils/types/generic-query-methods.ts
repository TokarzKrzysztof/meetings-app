import { AxiosError } from 'axios';
import { UseInfiniteQueryResult, UseMutationResult, UseQueryResult } from 'react-query';
import { PaginatedData } from 'src/models/paginated-data';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export const genericUseMutationMethods = <TName extends string, TData, TVariables, TContext>(
  name: TName,
  mutation: UseMutationResult<TData, AxiosError<HttpErrorData>, TVariables, TContext>
) => {
  return {
    [name]: mutation.mutate,
    [name + 'Async']: mutation.mutateAsync,
    [name + 'Result']: mutation.data,
    [name + 'Error']: mutation.error?.response?.data,
    [name + 'InProgress']: mutation.isLoading,
    [name + 'Reset']: mutation.reset,
  } as Record<TName, typeof mutation.mutate> &
    Record<`${TName}Async`, typeof mutation.mutateAsync> &
    Record<`${TName}Result`, TData | undefined> &
    Record<`${TName}Error`, HttpErrorData | undefined> &
    Record<`${TName}InProgress`, boolean> &
    Record<`${TName}Reset`, () => void>;
};

export const genericUseQueryMethods = <TName extends string, TData>(
  name: TName,
  query: UseQueryResult<TData, AxiosError<HttpErrorData>>
) => {
  return {
    [name]: query.data,
    [name + 'Loading']: query.isFetching || query.data === undefined,
    [name + 'Fetching']: query.isFetching,
    [name + 'FetchingError']: query.error,
    [name + 'Refetch']: query.refetch,
    [name + 'FetchedAfterMount']: query.isFetchedAfterMount,
  } as Record<TName, TData | undefined> &
    Record<`${TName}Loading`, boolean> &
    Record<`${TName}Fetching`, boolean> &
    Record<`${TName}FetchingError`, AxiosError<HttpErrorData> | null> &
    Record<`${TName}Refetch`, typeof query.refetch> &
    Record<`${TName}FetchedAfterMount`, boolean>;
};

export const genericUseInfiniteQueryMethods = <TName extends string, TData>(
  name: TName,
  query: UseInfiniteQueryResult<PaginatedData<TData>, AxiosError<HttpErrorData, any>>
) => {
  return {
    [name]: query.data?.pages.flatMap((x) => x.data),
    [name + 'Fetching']: query.isFetching,
    [name + 'FetchingError']: query.error,
    [name + 'Refetch']: query.refetch,
    [name + 'FetchedAfterMount']: query.isFetchedAfterMount,
    [name + 'FetchNextPage']: query.fetchNextPage,
    [name + 'HasNextPage']: query.hasNextPage,
  } as Record<TName, TData[] | undefined> &
    Record<`${TName}Fetching`, boolean> &
    Record<`${TName}FetchingError`, AxiosError<HttpErrorData> | null> &
    Record<`${TName}Refetch`, typeof query.refetch> &
    Record<`${TName}FetchedAfterMount`, boolean> &
    Record<`${TName}FetchNextPage`, typeof query.fetchNextPage> &
    Record<`${TName}HasNextPage`, typeof query.hasNextPage>;
};
