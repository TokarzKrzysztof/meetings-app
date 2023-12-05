import { ChatType } from 'src/models/chat/chat';
import { MessageType } from 'src/models/chat/message';
import { UserActiveStatus, UserGender } from 'src/models/user';

export type ChatPreview = {
  id: string;
  name: string;
  type: ChatType;
  hasUnreadMessages: boolean;
  hasLastMessage: boolean;
  lastMessageAuthorId: string | null;
  lastMessageValue: string | null;
  lastMessageDate: string | null;
  lastMessageType: MessageType | null;
  imageSrcs: (string | null)[];
  lastMessageAuthorGender: UserGender | null;
  lastMessageAuthorFirstName: string | null;
  participantId: string | null;
  participantActiveStatus: UserActiveStatus | null;
};