import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useRouteParams = <T extends Record<string, string>>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams);
  }, [searchParams]);

  const setParams = (params: T) => {
    setSearchParams(params);
  }

  return [params as T, setParams] as const;
};
