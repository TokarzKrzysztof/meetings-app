import { MessageType } from 'src/models/chat/message';

export type SendPrivateMessageData = {
  id: string;
  file?: File;
  connectionId: string;
  recipientId: string;
  value?: string;
  replyToId?: string;
  type: MessageType;
};
