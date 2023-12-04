import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Chat } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { useMarkChatAsRead } from 'src/queries/chat-queries';
import { replaceItem } from 'src/utils/array-utils';

export const useSignalRListeners = (
  chat: Chat | null | undefined,
  setMessages: (value: React.SetStateAction<Message[]>) => void
) => {
  const currentUser = useLoggedInUser();
  const { markChatAsRead } = useMarkChatAsRead();

  useSignalREffect(
    'onGetNewMessage',
    (msg) => {
      if (msg.authorId === currentUser.id) {
        setMessages((prev) => {
          // replace pending message
          replaceItem(prev, msg);
          return [...prev];
        });
      } else {
        setMessages((prev) => [...prev, msg]);
        markChatAsRead(chat!.id);
      }
    },
    [chat]
  );

  useSignalREffect('onMessageReactionChange', (message) => {
    setMessages((prev) => {
      replaceItem(prev, message);
      return [...prev];
    });
  });
};
