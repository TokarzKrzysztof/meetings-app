import { ChatType } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';

export type ChatPreview = {
  id: string;
  name: string | null;
  type: ChatType;
  hasUnreadMessages: boolean;
  lastMessage: Message;
  lastMessageAuthor: User;
  participants: User[];
};
