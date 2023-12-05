import { useQueryClient } from 'react-query';
import { Chat } from 'src/models/chat/chat';
import { User } from 'src/models/user';
import { getPrivateChatQueryKey } from 'src/queries/chat-queries';
import { getCurrentUserQueryKey } from 'src/queries/user-queries';

export const useSetQueryData = () => {
  const queryClient = useQueryClient();

  const setCurrentUser = (data: User | null) => {
    queryClient.setQueryData(getCurrentUserQueryKey, data);
  };

  const setPrivateChat = (data: Chat) => {
    queryClient.setQueryData(getPrivateChatQueryKey, data);
  };

  return { setCurrentUser, setPrivateChat };
};
