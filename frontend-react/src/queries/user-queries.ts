import axios, { AxiosError } from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import { User } from 'src/models/user';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export const useUserGetPasswordMinLength = (
  options?: UseQueryOptions<number, AxiosError<HttpErrorData, any>>
) => {
  const query = useQuery({
    queryKey: 'GetPasswordMinLength',
    queryFn: () =>
      axios.get(`${apiUrl}/User/GetPasswordMinLength`).then((res) => res.data),
    staleTime: Infinity,
    ...options,
  });

  return {
    passwordMinLength: query.data,
    passwordMinLengthFetching: query.isLoading,
    passwordMinLengthFetchingError: query.error,
  };
};

export const useUserRegister = (
  options?: UseMutationOptions<unknown, AxiosError<HttpErrorData>, User>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .post(`${apiUrl}/User/Register`, data)
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    registerUser: mutation.mutate,
    registerUserResult: mutation.data,
    registerUserError: mutation.error?.response?.data,
    registerUserInProgress: mutation.isLoading,
    registerUserReset: mutation.reset,
  };
};
