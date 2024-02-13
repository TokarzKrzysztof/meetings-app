import { User } from 'src/models/user';

export type AnnouncementResultListItem = {
  userId: string;
  announcementId: string;
  announcementCreatedAt: string;
  description: string;
  user: User;
  userAge: number;
  distanceFromCurrentUser: number | null;
};
