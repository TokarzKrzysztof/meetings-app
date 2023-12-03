import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';

export enum ChatType {
  Private,
  Group,
}

export type Chat = {
  id: string;
  participants: User[];
  totalMessagesAmount: number;
  messages: Message[];
};
