import { MessageReaction } from 'src/models/chat/message-reaction';
import { User } from 'src/models/user';

export enum MessageType {
  Text,
  Image,
  Audio,
  Info,
}


export type Message = {
  id: string;
  chatId: string;
  authorId: string;
  /**
   * null for reply message, for others always has value
   */
  author: User | null;
  replyTo: Message | null;
  value: string;
  type: MessageType;
  createdAt: string;
  reactions: MessageReaction[];

  // UI
  isPending: boolean;
  progressPercentage: number;
};
