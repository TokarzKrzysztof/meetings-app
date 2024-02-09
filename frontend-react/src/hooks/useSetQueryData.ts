import { useQueryClient } from 'react-query';
import { Chat } from 'src/models/chat/chat';
import { Message } from 'src/models/chat/message';
import { User } from 'src/models/user';
import { getPrivateChatQueryKey } from 'src/queries/chat-queries';
import { GetAllImageMessagesData, getAllImageMessagesQueryKey } from 'src/queries/message-queries';
import { getCurrentUserQueryKey } from 'src/queries/user-queries';

export const useSetQueryData = () => {
  const queryClient = useQueryClient();

  const setCurrentUser = (data: User | null) => {
    queryClient.setQueryData(getCurrentUserQueryKey, data);
  };

  const setPrivateChat = (data: Chat) => {
    queryClient.setQueryData(getPrivateChatQueryKey, data);
  };

  const addImageMessage = (chatId: Chat['id'], message: Message) => {
    const queryKey = getAllImageMessagesQueryKey(chatId);

    const data = queryClient.getQueryData(queryKey) as GetAllImageMessagesData | undefined;
    if (data === undefined) return;

    queryClient.setQueryData(queryKey, [...data, message]);
  };

  return { setCurrentUser, setPrivateChat, addImageMessage };
};
