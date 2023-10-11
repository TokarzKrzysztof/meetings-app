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
  options?: UseQueryOptions<number, AxiosError<HttpErrorData>>
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
  options?: UseMutationOptions<string, AxiosError<HttpErrorData>, User>
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
    registerUserSuccess: mutation.isSuccess,
    registerUserReset: mutation.reset,
  };
};

export const useAuthResendActivationLink = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, string>
) => {
  const mutation = useMutation({
    mutationFn: (email) => {
      const params = { email };
      return axios
        .post(`${baseUrl}/ResendActivationLink`, null, { params })
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    resendActivationLink: mutation.mutate,
    resendActivationLinkInProgress: mutation.isLoading,
  };
};

export const useAuthLogin = (
  options?: UseMutationOptions<
    User,
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

export const useAuthLogout = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, void>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${baseUrl}/Logout`, data).then((res) => res.data);
    },
    ...options,
  });

  return {
    logout: mutation.mutate,
    logoutResult: mutation.data,
    logoutError: mutation.error?.response?.data,
    logoutInProgress: mutation.isLoading,
    logoutReset: mutation.reset,
  };
};

export const useAuthSendForgotPasswordEmail = (
  options?: UseMutationOptions<unknown, AxiosError<HttpErrorData>, string>
) => {
  const mutation = useMutation({
    mutationFn: (email) => {
      const params = { email };
      return axios
        .post(`${baseUrl}/SendForgotPasswordEmail`, null, { params })
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    sendForgotPasswordEmail: mutation.mutate,
    sendForgotPasswordEmailSuccess: mutation.isSuccess,
    sendForgotPasswordEmailResult: mutation.data,
    sendForgotPasswordEmailError: mutation.error?.response?.data,
    sendForgotPasswordEmailInProgress: mutation.isLoading,
    sendForgotPasswordEmailReset: mutation.reset,
  };
};

export const useAuthResetPassword = (
  options?: UseMutationOptions<
    unknown,
    AxiosError<HttpErrorData>,
    { tempId: string; newPassword: string }
  >
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
