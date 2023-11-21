export type ChatPreview = {
  id: string;
  participantId: string;
  participantName: string;
  lastMessageAuthorId: string | null;
  lastMessageText: string | null;
  lastMessageDate: string | null;
};
