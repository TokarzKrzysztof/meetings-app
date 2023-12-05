import { MessageType } from 'src/models/chat/message';

export type SendMessageData = {
  id: string;
  file?: Blob;
  value?: string;
  replyToId?: string;
  type: MessageType;
  chatId: string;
};
