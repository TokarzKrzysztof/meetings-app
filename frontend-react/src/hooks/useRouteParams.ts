import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseIntoURLParams } from 'src/utils/url-utils';

export const useRouteParams = <T extends Record<string, unknown>>() => {
  const [searchParams, setSearchParams] = useSearchParams();

  const params = useMemo(() => {
    return Object.fromEntries(searchParams);
  }, [searchParams]);

  const setParams = (params: T) => {
    setSearchParams(parseIntoURLParams(params));
  }

  return [params as T, setParams] as const;
};
