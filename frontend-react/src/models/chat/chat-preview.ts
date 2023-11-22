export type ChatPreview = {
  id: string;
  participantId: string;
  participantName: string;
  hasUnreadMessages: boolean;
  lastMessageAuthorId: string | null;
  lastMessageText: string | null;
  lastMessageDate: string | null;
};
