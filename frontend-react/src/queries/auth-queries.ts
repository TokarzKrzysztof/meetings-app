import axios, { AxiosError } from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';
import { LoginCredentials } from 'src/models/login-credentials';
import { User } from 'src/models/user';
import { apiUrl } from 'src/utils/api-url';
import { genericUseMutationMethods } from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Auth`;

export const useRegister = (
  options?: UseMutationOptions<string, AxiosError<HttpErrorData>, User>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${baseUrl}/Register`, data).then((res) => res.data);
    },
    ...options,
  });

  return genericUseMutationMethods('registerUser', mutation);
};

export const useResendActivationLink = (
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

  return genericUseMutationMethods('resendActivationLink', mutation);
};

export const useLogin = (
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

  return genericUseMutationMethods('login', mutation);
};

export const useLogout = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, void>
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${baseUrl}/Logout`, data).then((res) => res.data);
    },
    ...options,
  });

  return genericUseMutationMethods('logout', mutation);
};

export const useSendForgotPasswordEmail = (
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

  return genericUseMutationMethods('sendForgotPasswordEmail', mutation);
};

export const useResetPassword = (
  options?: UseMutationOptions<
    unknown,
    AxiosError<HttpErrorData>,
    { tempId: string; newPassword: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .patch(`${baseUrl}/ResetPassword`, data)
        .then((res) => res.data);
    },
    ...options,
  });

  return genericUseMutationMethods('resetPassword', mutation);
};
