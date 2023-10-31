import { useAtomValue } from 'jotai';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';

export const useSignalRActions = () => {
  const connection = useAtomValue(connectionAtom);

  const sendPrivateMessage = (message: string, recipientId: string) => {
    return connection.invoke('sendPrivateMessage', message, recipientId);
  };
  const startTyping = (recipientId: string) => {
    return connection.invoke('startTyping', recipientId);
  }

  return { sendPrivateMessage, startTyping };
};
