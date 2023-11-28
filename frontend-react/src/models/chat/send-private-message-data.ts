import { MessageType } from 'src/models/chat/message';

export type SendPrivateMessageData = {
  id: string;
  file?: Blob;
  connectionId: string;
  recipientId: string;
  value?: string;
  replyToId?: string;
  type: MessageType;
};
