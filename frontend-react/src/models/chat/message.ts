import { MessageReaction } from "src/models/chat/message-reaction";

export type Message = {
  id: string;
  chatId: string;
  authorId: string;
  text: string;
  createdAt: string;
  reactions: MessageReaction[]
};