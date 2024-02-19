import { Dispatch } from 'react';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { useSetQueryData } from 'src/hooks/useSetQueryData';
import { Chat } from 'src/models/chat/chat';
import { MessageType } from 'src/models/chat/message';
import { MessageAction } from 'src/pages/chat/shared/reducers/message.reducer';
import { useMarkChatAsRead } from 'src/queries/chat-participant-queries';

export const useSignalRListeners = (
  chat: Chat | null | undefined,
  dispatch: Dispatch<MessageAction>
) => {
  const currentUser = useLoggedInUser();
  const { markChatAsRead } = useMarkChatAsRead();
  const { addImageMessage } = useSetQueryData();

  useSignalREffect(
    'onGetNewMessage',
    (message, chatId) => {
      if (chat?.id !== chatId) return;
      if (message.authorId === currentUser.id && message.type !== MessageType.Info) {
        dispatch({ type: 'replace', message });
      } else {
        dispatch({ type: 'append', message });
        markChatAsRead(chat!.id);
      }
      if (message.type === MessageType.Image) {
        addImageMessage(chatId, message);
      }
    },
    [chat]
  );

  useSignalREffect(
    'onMessageReactionChange',
    (message, chatId) => {
      if (chat?.id !== chatId) return;
      dispatch({ type: 'replace', message });
    },
    [chat]
  );
};
