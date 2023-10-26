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
  updatedAt: string;
};
