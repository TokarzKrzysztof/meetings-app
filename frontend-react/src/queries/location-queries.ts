import { AxiosError } from 'axios';
import { UseQueryOptions, useQuery } from 'react-query';
import axios from 'src/config/axios-config';
import { UserLocation } from 'src/models/user-location';
import { apiUrl } from 'src/utils/api-url';
import { genericUseQueryMethods } from 'src/utils/types/generic-query-methods';
import { HttpErrorData } from 'src/utils/types/http-error-data';

const baseUrl = `${apiUrl}/Location`;

export const useGetLocations = (
  options?: UseQueryOptions<UserLocation[], AxiosError<HttpErrorData>>
) => {
  const query = useQuery({
    queryKey: 'GetLocations',
    queryFn: () => axios.get(`${baseUrl}/GetLocations`),
    staleTime: Infinity,
    ...options,
  });

  return genericUseQueryMethods('locations', query);
};
