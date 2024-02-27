import { AnnouncementExperienceLevel } from 'src/models/annoucement/announcement';
import { UserGender } from 'src/models/user';
import { experienceLevelOptions } from 'src/utils/announcement-utils';
import { isEqual } from 'src/utils/utils';

export enum SortOption {
  Newest,
  Oldest,
  DistanceMin,
  DistanceMax,
}

export const filterConstants = {
  minAge: 0,
  maxAge: 100,
  defaultSortOption: SortOption.Newest
} as const;

export type ResultListFilters = {
  categoryId: string;
  distanceMax: number;
  ageRange: [number, number];
  gender: UserGender | null;
  experienceLevel: AnnouncementExperienceLevel | null;
};
export type ResultListQueryParams = ResultListFilters & {
  sortBy: SortOption;
};
export const getDefaultResultListQueryParams = (categoryId: string): ResultListQueryParams => ({
  categoryId,
  distanceMax: 500,
  ageRange: [filterConstants.minAge, filterConstants.maxAge],
  sortBy: filterConstants.defaultSortOption,
  gender: null,
  experienceLevel: null,
});

export const areResultListQueryParamsDefault = (params: ResultListQueryParams): boolean => {
  const defaults = getDefaultResultListQueryParams(params.categoryId);
  return isEqual(params, defaults, ['categoryId', 'sortBy']);
};

export const filterGenderOptions = [
  {
    value: null,
    label: 'Wszyscy',
  },
  {
    value: UserGender.Male,
    label: 'Mężczyźni',
  },
  {
    value: UserGender.Female,
    label: 'Kobiety',
  },
] as const;

export const filterExperienceLevelOptions = [
  {
    value: null,
    label: 'Wszystkie',
  },
  ...experienceLevelOptions,
] as const;
