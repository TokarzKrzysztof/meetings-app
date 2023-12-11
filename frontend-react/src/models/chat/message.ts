import { MessageReaction } from 'src/models/chat/message-reaction';

export enum MessageType {
  Text,
  Image,
  Audio,
}

export type Message = {
  id: string;
  chatId: string;
  authorId: string;
  authorName: string | null;
  replyTo: Message | null;
  value: string;
  type: MessageType;
  createdAt: string;
  reactions: MessageReaction[];

  // UI
  isPending: boolean;
  progressPercentage: number;
};
