import { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { Category } from 'src/models/category';
import { apiUrl } from 'src/utils/api-url';
import { genericUseQueryMethods } from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Category`;

export const useGetAllCategories = (
  options?: UseQueryOptions<Category[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetAllCategories',
    queryFn: () => axios.get(`${baseUrl}/GetAllCategories`),
    staleTime: Infinity,
    ...options,
  });

  return genericUseQueryMethods('allCategories', query);
};

export const useGetCategory = (
  id: Category['id'],
  options?: UseQueryOptions<Category, AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: ['GetCategory', id],
    queryFn: () => {
      const params = { id };
      return axios.get(`${baseUrl}/GetCategory`, { params });
    },
    staleTime: Infinity,
    ...options,
  });

  return genericUseQueryMethods('category', query);
};
