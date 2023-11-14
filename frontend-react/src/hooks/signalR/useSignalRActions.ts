import { useAtomValue } from 'jotai';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { Message } from 'src/models/chat/message';

export const useSignalRActions = () => {
  const connection = useAtomValue(connectionAtom);

  const sendPrivateMessage = (data: {
    recipientId: string;
    text: string;
    replyTo: Message | null;
  }) => {
    return connection.invoke('sendPrivateMessage', data);
  };
  const startTyping = (data: { chatId: string }) => {
    return connection.invoke('startTyping', data);
  };
  const setMessageReaction = (data: { messageId: string; reactionUnified: string }) => {
    return connection.invoke('setMessageReaction', data);
  };

  return { sendPrivateMessage, startTyping, setMessageReaction };
};
