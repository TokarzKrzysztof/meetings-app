import { User } from 'src/models/user';

export type UserProfile = {
  id: string;
  user: User;
  description: string | null;
  interests: string[];
};
