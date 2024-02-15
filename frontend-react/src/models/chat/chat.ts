import { User } from 'src/models/user';

export enum UserChatType {
  Private,
  Group,
  Ignored,
  Archived,
}

export enum ChatType {
  Private,
  Group,
}

export type Chat = {
  id: string;
  name: string | null;
  totalMessagesAmount: number;
  type: ChatType;
  participants: User[];
};
