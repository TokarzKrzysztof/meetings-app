import axios, { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import { Category } from 'src/models/category';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Category`;

export const useGetAllCategories = (
  options?: UseQueryOptions<Category[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetAllCategories',
    queryFn: () =>
      axios.get(`${baseUrl}/GetAllCategories`).then((res) => res.data),
    staleTime: Infinity,
    ...options,
  });

  return {
    allCategories: query.data,
    allCategoriesFetching: query.isFetching,
    allCategoriesFetchingError: query.error,
  };
};
