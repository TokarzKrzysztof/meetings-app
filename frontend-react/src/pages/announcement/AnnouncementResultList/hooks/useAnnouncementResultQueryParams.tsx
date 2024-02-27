import { useSearchParams } from 'react-router-dom';
import { ResultListQueryParams } from 'src/utils/announcement-result-list-utils';
import { parseIntoURLParams } from 'src/utils/url-utils';

export const useAnnouncementResultListQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: ResultListQueryParams) => {
    setSearchParams(parseIntoURLParams(params));
  };

  const stringParam = (name: keyof ResultListQueryParams) => {
    return searchParams.get(name)!;
  };
  const numberParam = (name: keyof ResultListQueryParams) => {
    if (!searchParams.has(name)) return null
    return +searchParams.get(name)!;
  };
  const rangeParam = (name: keyof ResultListQueryParams): [number, number] => {
    try {
      const result = searchParams
        .get(name)!
        .split(',')
        .map((x) => +x);

      return result as [number, number];
    } catch (err) {
      console.warn(err);
      return [0, 0];
    }
  };

  const params: ResultListQueryParams = {
    categoryId: stringParam('categoryId'),
    distanceMax: numberParam('distanceMax')!,
    ageRange: rangeParam('ageRange'),
    sortBy: numberParam('sortBy')!,
    gender: numberParam('gender'),
    experienceLevel: numberParam('experienceLevel'),
  };
  return [params, setParams] as const;
};
