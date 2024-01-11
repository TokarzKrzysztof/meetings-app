import _ from 'lodash';

export enum GenderFilter {
  All,
  Males,
  Females,
}
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

export type AnnouncementResultListParams = {
  categoryId: string;
  gender: GenderFilter;
  distanceMax: number;
  ageRange: [number, number];
  sortBy: SortOption;
};
export const getDefaultAnnouncementResultListParams = (
  categoryId: string
): AnnouncementResultListParams => ({
  categoryId,
  gender: GenderFilter.All,
  distanceMax: 500,
  ageRange: [announcementFilterConstants.minAge, announcementFilterConstants.maxAge],
  sortBy: SortOption.Newest
});

export const areAnnouncementResultListParamsDefault = (
  params: AnnouncementResultListParams
): boolean => {
  const defaults = getDefaultAnnouncementResultListParams(params.categoryId);
  return _.isEqual(params, defaults);
};
