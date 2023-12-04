import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { MyChatsListItem } from 'src/pages/chat/MyChats/MyChatsListItem';
import { MyChatsPanel } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsPanel';
import { useGetCurrentUserGroupChats } from 'src/queries/chat-queries';

export const MyChatsGroup = () => {
  const { currentUserGroupChats, currentUserGroupChatsRefetch } = useGetCurrentUserGroupChats();

  useSignalREffect('onGetNewMessage', () => {
    currentUserGroupChatsRefetch();
  });

  if (!currentUserGroupChats) return null;
  return (
    <MyChatsPanel noChatsText={'Brak grupowych rozmów'}>
      {currentUserGroupChats.map((chat) => (
        <MyChatsListItem key={chat.id} chat={chat} />
      ))}
    </MyChatsPanel>
  );
};

MyChatsGroup.displayName = 'MyChatsGroup';
