import { Header } from 'src/components/header/Header';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { MyChatsItem } from 'src/pages/chat/MyChats/MyChatsItem';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';
import { List, Typography } from 'src/ui-components';

export const MyChats = () => {
  const { currentUserChats, currentUserChatsRefetch } = useGetCurrentUserChats();

  useSignalREffect('onGetNewMessage', () => {
    currentUserChatsRefetch();
  });

  if (!currentUserChats) return null;
  return (
    <>
      <Header />
      {currentUserChats.length ? (
        <List>
          {currentUserChats.map((chat) => (
            <MyChatsItem key={chat.id} chat={chat} />
          ))}
        </List>
      ) : (
        <Typography mt={6} textAlign={'center'} color={'grey'}>
          Nie masz jeszcze żadnych rozmów
        </Typography>
      )}
    </>
  );
};

MyChats.displayName = 'MyChats';
