import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { MyChatsItemCommonActions } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsItemCommonActions';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { useGetCurrentUserGroupChats } from 'src/queries/chat-queries';

export const MyChatsGroup = () => {
  const { currentUserGroupChats, currentUserGroupChatsRefetch } = useGetCurrentUserGroupChats();

  useSignalREffect('onGetNewMessage', () => {
    currentUserGroupChatsRefetch();
  });

  if (!currentUserGroupChats) return null;
  return (
    <MyChatsList noChatsText='Brak grupowych rozmów'>
      {currentUserGroupChats.map((chat) => (
        <MyChatsListItem
          key={chat.id}
          chat={chat}
          menuItems={
            <MyChatsItemCommonActions chat={chat} onReload={currentUserGroupChatsRefetch} />
          }
        />
      ))}
    </MyChatsList>
  );
};

MyChatsGroup.displayName = 'MyChatsGroup';
