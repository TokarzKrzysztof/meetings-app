import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { MyChatsListItem } from 'src/pages/chat/MyChats/MyChatsListItem';
import { MyChatsPanel } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsPanel';
import { useGetCurrentUserPrivateChats } from 'src/queries/chat-queries';

export const MyChatsPrivate = () => {
  const { currentUserPrivateChats, currentUserPrivateChatsRefetch } = useGetCurrentUserPrivateChats();

  useSignalREffect('onGetNewMessage', () => {
    currentUserPrivateChatsRefetch();
  });

  if (!currentUserPrivateChats) return null;
  return (
    <MyChatsPanel noChatsText={'Brak prywatnych rozmów'}>
      {currentUserPrivateChats.map((chat) => (
        <MyChatsListItem key={chat.id} chat={chat} />
      ))}
    </MyChatsPanel>
  );
};

MyChatsPrivate.displayName = 'MyChatsPrivate';
