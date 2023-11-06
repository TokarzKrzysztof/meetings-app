import { MessageReaction } from "src/models/conversation/message-reaction";

export type Message = {
  id: string;
  conversationId: string;
  authorId: string;
  text: string;
  createdAt: string;
  reactions: MessageReaction[]
};
