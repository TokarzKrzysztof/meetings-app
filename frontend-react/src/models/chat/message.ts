import { MessageReaction } from "src/models/chat/message-reaction";

export type Message = {
  id: string;
  chatId: string;
  authorId: string;
  replyTo: Message | null;
  text: string;
  createdAt: string;
  reactions: MessageReaction[]
};
