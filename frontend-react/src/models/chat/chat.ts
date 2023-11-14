import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';

export type Chat = {
  id: string;
  participants: User[];
  totalMessagesAmount: number;
  messages: Message[];
};
