import { MessageType } from "src/models/chat/message";
import { UserActiveStatus, UserGender } from "src/models/user";

export type ChatPreview = {
  id: string;
  participantId: string;
  participantFirstName: string;
  participantLastName: string;
  participantGender: UserGender;
  participantProfileImageSrc: string | null;
  participantActiveStatus: UserActiveStatus;
  hasUnreadMessages: boolean;
  hasLastMessage: boolean;
  lastMessageAuthorId: string | null;
  lastMessageValue: string | null;
  lastMessageDate: string | null;
  lastMessageType: MessageType | null;
};
