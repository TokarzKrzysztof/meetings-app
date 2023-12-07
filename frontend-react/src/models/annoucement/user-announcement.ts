import { Announcement } from 'src/models/annoucement/announcement';
import { User } from 'src/models/user';

export type UserAnnouncement = {
    userId: User['id'];
    announcementId: Announcement['id'];
    description: Announcement['description'];
    userBirthDate: string;
    userFirstName: string;
    userProfileImageSrc: string | null;
};
