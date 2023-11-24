import { MessageType } from 'src/models/chat/message';

type BasePrivateMessageData = {
  connectionId: string;
  recipientId: string;
  replyToId?: string;
};

export type TextPrivateMessageData = {
  value: string;
  type: MessageType.Text;
};

export type ImagePrivateMessageData = {
  file: File;
  type: MessageType.Image;
};

export type SendPrivateMessageData = BasePrivateMessageData &
  (TextPrivateMessageData | ImagePrivateMessageData);
