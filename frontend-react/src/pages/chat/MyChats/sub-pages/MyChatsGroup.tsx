import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { ChatType } from 'src/models/chat/chat';
import { MyChatsListItem } from 'src/pages/chat/MyChats/MyChatsListItem';
import { MyChatsPanel } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsPanel';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';

export const MyChatsGroup = () => {
  const { currentUserChats, currentUserChatsRefetch } = useGetCurrentUserChats(ChatType.Group);

  useSignalREffect('onGetNewMessage', () => {
    currentUserChatsRefetch();
  });

  if (!currentUserChats) return null;
  return (
    <MyChatsPanel noChatsText={'Brak grupowych rozmów'}>
      {currentUserChats.map((chat) => (
        <MyChatsListItem key={chat.id} chat={chat} />
      ))}
    </MyChatsPanel>
  );
};

MyChatsGroup.displayName = 'MyChatsGroup';
