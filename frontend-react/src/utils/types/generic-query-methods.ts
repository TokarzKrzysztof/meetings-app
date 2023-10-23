import { AxiosError } from 'axios';
import { UseMutationResult, UseQueryResult } from 'react-query';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export const genericUseMutationMethods = <TName extends string, TData, TVariables, TContext>(
  name: TName,
  mutation: UseMutationResult<TData, AxiosError<HttpErrorData>, TVariables, TContext>,
) => {
  return {
    [name]: mutation.mutate,
    [name + 'Result']: mutation.data,
    [name + 'Error']: mutation.error?.response?.data,
    [name + 'InProgress']: mutation.isLoading,
    [name + 'Reset']: mutation.reset,
  } as Record<TName, typeof mutation.mutate> &
    Record<`${TName}Result`, TData | undefined> &
    Record<`${TName}Error`, HttpErrorData | undefined> &
    Record<`${TName}InProgress`, boolean> &
    Record<`${TName}Reset`, () => void>;
};

export const genericUseQueryMethods = <TName extends string, TData>(
  name: TName,
  query: UseQueryResult<TData, AxiosError<HttpErrorData>>,
) => {
  return {
    [name]: query.data,
    [name + 'Fetching']: query.isFetching,
    [name + 'FetchingError']: query.error,
    [name + 'Refetch']: query.refetch,
  } as Record<TName, TData | undefined> &
    Record<`${TName}Fetching`, boolean> &
    Record<`${TName}FetchingError`, AxiosError<HttpErrorData> | null> &
    Record<`${TName}Refetch`, typeof query.refetch>;
};
