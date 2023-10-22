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

const baseUrl = `${apiUrl}/User`;

export const useIsEmailTaken = (
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
    isEmailTaken: mutation.mutate,
    isEmailTakenResult: mutation.data,
    isEmailTakenError: mutation.error?.response?.data,
    isEmailTakenInProgress: mutation.isLoading,
    isEmailTakenReset: mutation.reset,
  };
};

export const getCurrentUserQueryKey = 'GetCurrentUser';
export const getCurrentUserQueryFn = () =>
  axios.get(`${baseUrl}/GetCurrentUser`).then((res) => res.data);
export const useGetCurrentUser = (
  options?: UseQueryOptions<User | null, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: getCurrentUserQueryKey,
    queryFn: getCurrentUserQueryFn,
    staleTime: Infinity,
    ...options,
  });

  return {
    currentUser: query.data,
    currentUserFetching: query.isLoading,
    currentUserFetchingError: query.error,
    currentUserRefetch: query.refetch,
  };
};

export const useUploadProfileImage = (
  options?: UseMutationOptions<void, AxiosError<HttpErrorData>, Blob>
) => {
  const mutation = useMutation({
    mutationFn: (image) => {
      const formData = new FormData();
      formData.append('image', image);
      return axios
        .post(`${baseUrl}/UploadProfileImage`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    uploadProfileImage: mutation.mutate,
    uploadProfileImageResult: mutation.data,
    uploadProfileImageError: mutation.error?.response?.data,
    uploadProfileImageInProgress: mutation.isLoading,
    uploadProfileImageReset: mutation.reset,
  };
};

export const useChangePassword = (
  options?: UseMutationOptions<
    void,
    AxiosError<HttpErrorData>,
    { existingPassword: string; newPassword: string }
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .patch(`${baseUrl}/ChangePassword`, data)
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    changePassword: mutation.mutate,
    changePasswordResult: mutation.data,
    changePasswordError: mutation.error?.response?.data,
    changePasswordInProgress: mutation.isLoading,
    changePasswordReset: mutation.reset,
  };
};

export const useChangePersonalData = (
  options?: UseMutationOptions<
    User,
    AxiosError<HttpErrorData>,
    Pick<User, 'firstName' | 'lastName' | 'birthDate' | 'gender'>
  >
) => {
  const mutation = useMutation({
    mutationFn: (data) => {
      return axios
        .put(`${baseUrl}/ChangePersonalData`, data)
        .then((res) => res.data);
    },
    ...options,
  });

  return {
    changePersonalData: mutation.mutate,
    changePersonalDataResult: mutation.data,
    changePersonalDataError: mutation.error?.response?.data,
    changePersonalDataInProgress: mutation.isLoading,
    changePersonalDataReset: mutation.reset,
  };
};
