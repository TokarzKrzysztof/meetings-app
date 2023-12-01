import { Message } from 'src/models/chat/message';

export const getFocusableId = (messageId: Message['id']) => {
  return `focusable-${messageId}`;
};
