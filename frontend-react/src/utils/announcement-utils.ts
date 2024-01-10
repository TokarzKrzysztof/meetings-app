export enum GenderFilter {
  All = 'all',
  Males = 'males',
  Females = 'females',
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
};
export const getDefaultAnnouncementResultListParams = (
  categoryId: string
): AnnouncementResultListParams => ({
  categoryId,
  gender: GenderFilter.All,
  distanceMax: 500,
  ageRange: [announcementFilterConstants.minAge, announcementFilterConstants.maxAge],
});
