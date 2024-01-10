
export enum GenderFilter {
  All = 'all',
  Males = 'males',
  Females = 'females',
}

export const announcementFilterConstants = {
  distanceMax: 500,
  minAge: 0,
  maxAge: 100,
} as const;

export type AnnouncementResultListParams = {
  categoryId: string;
  gender: GenderFilter;
  distanceMax: number;
  ageRange: [number, number];
};
export const defaultAnnouncementResultListParams: AnnouncementResultListParams = {
  categoryId: '',
  gender: GenderFilter.All,
  distanceMax: announcementFilterConstants.distanceMax,
  ageRange: [announcementFilterConstants.minAge, announcementFilterConstants.maxAge],
};
