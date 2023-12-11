import { ChatType } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';

export type ChatPreview = {
  id: string;
  name: string;
  type: ChatType;
  hasUnreadMessages: boolean;
  lastMessage: Message | null;
  participants: User[];
};
