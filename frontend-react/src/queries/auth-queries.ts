import { AxiosError } from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';
import axios from 'src/config/axios-config';
import { LoginCredentials } from 'src/models/login-credentials';
import { User } from 'src/models/user';
import { apiUrl } from 'src/utils/api-url';
import { genericUseMutationMethods } from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Auth`;

export const useRegister = (
  options?: UseMutationOptions<
    User['email'],
    AxiosError<HttpErrorData>,
    User & { redirectUrl?: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/Register`, data),
    ...options,
  });

  return genericUseMutationMethods('registerUser', mutation);
};

export const useResendActivationLink = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, User['email']>
) => {
  const mutation = useMutation({
    mutationFn: (email) => {
      const params = { email };
      return axios.post(`${baseUrl}/ResendActivationLink`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('resendActivationLink', mutation);
};

export const useLogin = (
  options?: UseMutationOptions<User, AxiosError<HttpErrorData>, LoginCredentials>
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.post(`${baseUrl}/Login`, data),
    ...options,
  });

  return genericUseMutationMethods('login', mutation);
};

export const useLogout = (options?: UseMutationOptions<void, AxiosError<HttpErrorData>, void>) => {
  const mutation = useMutation({
    mutationFn: () => axios.post(`${baseUrl}/Logout`),
    ...options,
  });

  return genericUseMutationMethods('logout', mutation);
};

export const useSendForgotPasswordEmail = (
  options?: UseMutationOptions<unknown, AxiosError<HttpErrorData>, User['email']>
) => {
  const mutation = useMutation({
    mutationFn: (email) => {
      const params = { email };
      return axios.post(`${baseUrl}/SendForgotPasswordEmail`, null, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('sendForgotPasswordEmail', mutation);
};

export const useResetPassword = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { tempId: string; newPassword: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.patch(`${baseUrl}/ResetPassword`, data),
    ...options,
  });

  return genericUseMutationMethods('resetPassword', mutation);
};

export const useRemoveAccount = (
  options?: UseMutationOptions<unknown, AxiosError<HttpErrorData>, void>
) => {
  const mutation = useMutation({
    mutationFn: () => axios.delete(`${baseUrl}/RemoveAccount`),
    ...options,
  });

  return genericUseMutationMethods('removeAccount', mutation);
};
