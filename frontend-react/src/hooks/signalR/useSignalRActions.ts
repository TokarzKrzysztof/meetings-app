import { useAtomValue } from 'jotai';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';

export const useSignalRActions = () => {
  const connection = useAtomValue(connectionAtom);

  const sendPrivateMessage = (data: { recipientId: string; message: string }) => {
    return connection.invoke('sendPrivateMessage', data);
  };
  const startTyping = (data: { chatId: string | undefined }) => {
    return connection.invoke('startTyping', data);
  };
  const addMessageReaction = (data: { messageId: string; reactionUnified: string }) => {
    return connection.invoke('addMessageReaction', data);
  };

  return { sendPrivateMessage, startTyping, addMessageReaction };
};
