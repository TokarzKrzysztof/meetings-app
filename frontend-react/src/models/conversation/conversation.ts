import { Message } from 'src/models/conversation/message';

export type Conversation = {
  id: string;
  participantIds: [string, string];
  messages: Message[];
};
