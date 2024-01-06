import { User } from 'src/models/user';

export type NewGroupChatFormData = {
  name: string;
  users: User[];
};
