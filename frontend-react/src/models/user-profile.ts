import { User } from 'src/models/user';

export type Interest = {
  id: string;
  iconName: string;
  name: string;
};

export type UserProfile = {
  id: string;
  user: User;
  description: string | null;
  interests: Interest[];
};
