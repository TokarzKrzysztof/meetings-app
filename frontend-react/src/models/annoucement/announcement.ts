export enum AnnouncementExperienceLevel {
  Begginer,
  Indermediate,
  Advanced,
  Professional,
}
export enum AnnouncementStatus {
  Active,
  Pending,
  Closed,
}

export type Announcement = {
  id: string;
  categoryId: string;
  userId: string;
  description: string;
  status: AnnouncementStatus;
  createdAt: string;
  experienceLevel: AnnouncementExperienceLevel | null;
};
