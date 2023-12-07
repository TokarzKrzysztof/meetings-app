import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { UseMutateFunction, UseMutationOptions } from 'react-query';
import { useArray } from 'src/hooks/useArray';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export const useQueue = <TData, TResult>(
  send: UseMutateFunction<TResult, AxiosError<HttpErrorData, unknown>, TData, unknown>,
  options: UseMutationOptions<TResult, AxiosError<HttpErrorData>, TData> = {}
) => {
  const [inProgress, setInProgress] = useState(false);
  const { array, push: addToQueue, remove } = useArray<TData>([]);

  useEffect(() => {
    if (inProgress || array.length === 0) return;

    setInProgress(true);
    send(array[0], {
      onSuccess: (data, variables, context) => {
        options?.onSuccess && options.onSuccess(data, variables, context);
        setInProgress(false);
        remove(0);
      },
    });
  }, [array, inProgress]);

  return { addToQueue };
};
