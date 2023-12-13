import { User } from 'src/models/user';

export type GroupChatFormData = {
  name: string;
  users: User[];
};
