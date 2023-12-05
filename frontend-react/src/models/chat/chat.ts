import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';

export enum ChatType {
  Private,
  Group,
}

export type Chat = {
  id: string;
  name: string | null;
  totalMessagesAmount: number;
  messages: Message[];
  participants: User[];
  type: ChatType;
};
