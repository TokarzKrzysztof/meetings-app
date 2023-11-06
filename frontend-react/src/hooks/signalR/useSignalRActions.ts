import { useAtomValue } from 'jotai';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';

export const useSignalRActions = () => {
  const connection = useAtomValue(connectionAtom);

  const sendPrivateMessage = (data: { recipientId: string; message: string }) => {
    return connection.invoke('sendPrivateMessage', data);
  };
  const startTyping = (data: { recipientId: string }) => {
    return connection.invoke('startTyping', data);
  };
  const addMessageReaction = (data: { recipientId: string; messageId: string; reactionUnified: string }) => {
    return connection.invoke('addMessageReaction', data);
  };

  return { sendPrivateMessage, startTyping, addMessageReaction };
};
