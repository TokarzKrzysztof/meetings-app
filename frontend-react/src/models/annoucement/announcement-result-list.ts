import { AnnouncementExperienceLevel } from 'src/models/annoucement/announcement';
import { User } from 'src/models/user';

export type AnnouncementResultListItem = {
  userId: string;
  announcementId: string;
  announcementCreatedAt: string;
  announcementExperienceLevel: AnnouncementExperienceLevel | null;
  description: string;
  user: User;
  userAge: number;
  distanceFromCurrentUser: number | null;
};
