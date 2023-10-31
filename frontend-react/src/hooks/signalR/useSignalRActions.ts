import { useAtomValue } from 'jotai';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';

export const useSignalRActions = () => {
  const connection = useAtomValue(connectionAtom);

  const sendPrivateMessage = (message: string, recipientId: string) => {
    return connection.invoke('SendPrivateMessage', message, recipientId);
  };

  return { sendPrivateMessage };
};
