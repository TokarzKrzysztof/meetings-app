import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useRouteParams = <T extends Record<string, unknown>>() => {
  const [searchParams] = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams);
  }, [searchParams]);

  return params as T;
};
