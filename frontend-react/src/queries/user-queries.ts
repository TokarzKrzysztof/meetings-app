import { AxiosError } from 'axios';
import {
  UseMutationOptions,
  UseQueryOptions,
  useMutation,
  useQuery,
} from 'react-query';
import axios from 'src/config/axios-config';
import { User } from 'src/models/user';
import { apiUrl } from 'src/utils/api-url';
import {
  genericUseMutationMethods,
  genericUseQueryMethods,
} from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/User`;

export const useIsEmailTaken = (
  options?: UseMutationOptions<boolean, AxiosError<HttpErrorData>, string>
) => {
  const mutation = useMutation({
    mutationFn: (email) => {
      const params = { email };
      return axios.get(`${baseUrl}/IsEmailTaken`, { params });
    },
    ...options,
  });

  return genericUseMutationMethods('isEmailTaken', mutation);
};

export const getCurrentUserQueryKey = 'GetCurrentUser';
export const getCurrentUserQueryFn = () =>
  axios.get(`${baseUrl}/GetCurrentUser`);
export const useGetCurrentUser = (
  options?: UseQueryOptions<User | null, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: getCurrentUserQueryKey,
    queryFn: getCurrentUserQueryFn,
    staleTime: Infinity,
    ...options,
  });

  return genericUseQueryMethods('currentUser', query);
};

export const useUploadProfileImage = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Blob>
) => {
  const mutation = useMutation({
    mutationFn: (image) => {
      const formData = new FormData();
      formData.append('image', image);
      return axios.post(`${baseUrl}/UploadProfileImage`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    ...options,
  });

  return genericUseMutationMethods('uploadProfileImage', mutation);
};

export const useChangePassword = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { existingPassword: string; newPassword: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.patch(`${baseUrl}/ChangePassword`, data),
    ...options,
  });

  return genericUseMutationMethods('changePassword', mutation);
};

export const useChangePersonalData = (
  options?: UseMutationOptions<
    User,
    AxiosError<HttpErrorData>,
    Pick<User, 'firstName' | 'lastName' | 'birthDate' | 'gender'>
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => axios.put(`${baseUrl}/ChangePersonalData`, data),
    ...options,
  });

  return genericUseMutationMethods('changePersonalData', mutation);
};

export const useSendChangeEmailAddressEmail = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { password: string; email: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) =>
      axios.patch(`${baseUrl}/SendChangeEmailAddressEmail`, data),
    ...options,
  });

  return genericUseMutationMethods('sendChangeEmailAddressEmail', mutation);
};
