import { useAtomValue } from 'jotai';
import { DependencyList, useEffect } from 'react';
import { connectionAtom } from 'src/hooks/signalR/connectionAtom';
import { Message } from 'src/models/chat/message';

type SignalRListeners = {
  onGetNewMessage: (message: Message, chatId: string) => void;
  onOtherUserTyping: (userId: string, chatId: string) => void;
  onMessageReactionChange: (message: Message, chatId: string) => void;
  onNewChatCreated: (chatId: string) => void;
};
export const useSignalREffect = <TName extends keyof SignalRListeners>(
  name: TName,
  callback: SignalRListeners[TName],
  deps: DependencyList = []
) => {
  const connection = useAtomValue(connectionAtom);

  useEffect(() => {
    const _callback = callback;

    connection.on(name, _callback);
    return () => {
      connection.off(name, _callback);
    };
  }, deps);
};
