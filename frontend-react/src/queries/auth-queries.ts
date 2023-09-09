import axios, { AxiosError } from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import { LoginCredentials } from 'src/models/login-credentials';
import { User } from 'src/models/user';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Auth`;

export const useAuthGetPasswordMinLength = (
  options?: UseQueryOptions<number, AxiosError<HttpErrorData, any>>
) => {
  const query = useQuery({
    queryKey: 'GetPasswordMinLength',
    queryFn: () =>
      axios.get(`${baseUrl}/GetPasswordMinLength`).then((res) => res.data),
    staleTime: Infinity,
    ...options,
  });

  return {
    passwordMinLength: query.data,
    passwordMinLengthFetching: query.isLoading,
    passwordMinLengthFetchingError: query.error,
  };
};

export const useAuthRegister = (
  options?: UseMutationOptions<unknown, AxiosError<HttpErrorData>, User>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${baseUrl}/Register`, data).then((res) => res.data);
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

export const useAuthLogin = (
  options?: UseMutationOptions<
    string,
    AxiosError<HttpErrorData>,
    LoginCredentials
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${baseUrl}/Login`, data).then((res) => res.data);
    },
    ...options,
  });

  return {
    login: mutation.mutate,
    loginResult: mutation.data,
    loginError: mutation.error?.response?.data,
    loginInProgress: mutation.isLoading,
    loginReset: mutation.reset,
  };
};

export const useAuthResetPassword = (
  options?: UseMutationOptions<unknown, AxiosError<HttpErrorData>, string>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .post(`${baseUrl}/ResetPassword`, data)
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    resetPassword: mutation.mutate,
    resetPasswordSuccess: mutation.isSuccess,
    resetPasswordResult: mutation.data,
    resetPasswordError: mutation.error?.response?.data,
    resetPasswordInProgress: mutation.isLoading,
    resetPasswordReset: mutation.reset,
  };
};
