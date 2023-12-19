import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { MyChatsItemCommonActions } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsItemCommonActions';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { useGetCurrentUserPrivateChats } from 'src/queries/chat-queries';

export const MyChatsPrivate = () => {
  const { currentUserPrivateChats, currentUserPrivateChatsRefetch } =
    useGetCurrentUserPrivateChats();

  useSignalREffect('onGetNewMessage', () => {
    currentUserPrivateChatsRefetch();
  });

  if (!currentUserPrivateChats) return null;
  return (
    <MyChatsList noChatsText='Brak prywatnych rozmów'>
      {currentUserPrivateChats.map((chat) => (
        <MyChatsListItem
          key={chat.id}
          chat={chat}
          menuItems={
            <MyChatsItemCommonActions chat={chat} onReload={currentUserPrivateChatsRefetch} />
          }
        />
      ))}
    </MyChatsList>
  );
};

MyChatsPrivate.displayName = 'MyChatsPrivate';
