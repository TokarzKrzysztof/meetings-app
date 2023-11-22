import { UserActiveStatus } from "src/models/user";

export type ChatPreview = {
  id: string;
  participantId: string;
  participantName: string;
  participantActiveStatus: UserActiveStatus;
  hasUnreadMessages: boolean;
  lastMessageAuthorId: string | null;
  lastMessageText: string | null;
  lastMessageDate: string | null;
};
