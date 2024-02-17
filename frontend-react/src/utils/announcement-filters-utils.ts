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

export const announcementFilterConstants = {
  minAge: 0,
  maxAge: 100,
} as const;

export type AnnouncementResultListQueryParams = {
  categoryId: string;
  distanceMax: number;
  ageRange: [number, number];
  sortBy: SortOption;
  gender: UserGender | null;
  experienceLevel: AnnouncementExperienceLevel | null;
};
export const getDefaultAnnouncementResultListQueryParams = (
  categoryId: string
): AnnouncementResultListQueryParams => ({
  categoryId,
  distanceMax: 500,
  ageRange: [announcementFilterConstants.minAge, announcementFilterConstants.maxAge],
  sortBy: SortOption.Newest,
  gender: null,
  experienceLevel: null
});

export const areAnnouncementResultListFiltersDefault = (
  params: AnnouncementResultListQueryParams
): boolean => {
  const defaults = getDefaultAnnouncementResultListQueryParams(params.categoryId);
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
  ...experienceLevelOptions
] as const;