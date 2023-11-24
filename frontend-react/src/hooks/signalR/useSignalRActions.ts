import { useAtomValue } from 'jotai';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';

export const useSignalRActions = () => {
  const connection = useAtomValue(connectionAtom);

  const startTyping = (data: { chatId: string }) => {
    return connection.invoke('startTyping', data);
  };
  const setMessageReaction = (data: { messageId: string; reactionUnified: string }) => {
    return connection.invoke('setMessageReaction', data);
  };
  const startListenNewChat = (data: { chatId: string }) => {
    return connection.invoke('startListenNewChat', data);
  };

  return { startTyping, setMessageReaction, startListenNewChat };
};
