import axios, { AxiosError } from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/User`;

export const useUserIsEmailTaken = (
  options?: UseMutationOptions<boolean, AxiosError<HttpErrorData>, string>
) => {
  const mutation = useMutation({
    mutationFn: (email) => {
      const params = { email };
      return axios
        .get(`${baseUrl}/IsEmailTaken`, { params })
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    isEmailTaken: mutation.mutateAsync,
    isEmailTakenResult: mutation.data,
    isEmailTakenError: mutation.error?.response?.data,
    isEmailTakenInProgress: mutation.isLoading,
    isEmailTakenReset: mutation.reset,
  };
};
