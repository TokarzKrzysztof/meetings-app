import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { ChatType } from 'src/models/chat/chat';
import { MyChatsListItem } from 'src/pages/chat/MyChats/MyChatsListItem';
import { MyChatsPanel } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsPanel';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';

export const MyChatsPrivate = () => {
  const { currentUserChats, currentUserChatsRefetch } = useGetCurrentUserChats(ChatType.Private);

  useSignalREffect('onGetNewMessage', () => {
    currentUserChatsRefetch();
  });

  if (!currentUserChats) return null;
  return (
    <MyChatsPanel noChatsText={'Brak prywatnych rozmów'}>
      {currentUserChats.map((chat) => (
        <MyChatsListItem key={chat.id} chat={chat} />
      ))}
    </MyChatsPanel>
  );
};

MyChatsPrivate.displayName = 'MyChatsPrivate';
