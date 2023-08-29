import axios, { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import { Category } from 'src/models/category';
import { apiUrl } from 'src/utils/api-url';
import { HttpErrorData } from 'src/utils/types/http-error-data';

export const useCategoryGetAllCategories = (
  options?: UseQueryOptions<Category[], AxiosError<HttpErrorData, any>>
) => {
  const query = useQuery({
    queryKey: 'GetAllCategories',
    queryFn: () =>
      axios.get(`${apiUrl}/Category/GetAllCategories`).then((res) => res.data),
    ...options,
  });

  return {
    categories: query.data,
    categoriesFetching: query.isFetching,
    categoriesFetchingError: query.error,
  };
};
