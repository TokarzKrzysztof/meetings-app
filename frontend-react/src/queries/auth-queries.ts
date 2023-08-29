import axios, { AxiosError } from 'axios';
import { UseMutationOptions, useMutation } from 'react-query';
import { LoginCredentials } from 'src/models/login-credentials';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export const useAuthLogin = (
  options?: UseMutationOptions<
    string,
    AxiosError<HttpErrorData>,
    LoginCredentials
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios.post(`${apiUrl}/Auth/Login`, data).then((res) => res.data);
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
        .post(`${apiUrl}/Auth/ResetPassword`, data)
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