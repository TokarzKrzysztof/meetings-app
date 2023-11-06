import { Message } from 'src/models/chat/message';

export type Chat = {
  id: string;
  participantIds: [string, string];
  messages: Message[];
};
