import { useSearchParams } from 'react-router-dom';
import { AnnouncementResultListParams } from 'src/utils/announcement-filters-utils';
import { parseIntoURLParams } from 'src/utils/url-utils';

export const useAnnouncementResultListFilterParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const setParams = (params: AnnouncementResultListParams) => {
    setSearchParams(parseIntoURLParams(params));
  };

  const stringParam = <TName extends keyof AnnouncementResultListParams>(
    name: TName
  ): AnnouncementResultListParams[TName] => {
    return searchParams.get(name) as AnnouncementResultListParams[TName];
  };
  const numberParam = (name: keyof AnnouncementResultListParams): number => {
    return +searchParams.get(name)!;
  };
  const rangeParam = (name: keyof AnnouncementResultListParams): [number, number] => {
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

  const params: AnnouncementResultListParams = {
    categoryId: stringParam('categoryId'),
    gender: numberParam('gender'),
    distanceMax: numberParam('distanceMax'),
    ageRange: rangeParam('ageRange'),
    sortBy: numberParam('sortBy'),
  };

  return [params, setParams] as const;
};
