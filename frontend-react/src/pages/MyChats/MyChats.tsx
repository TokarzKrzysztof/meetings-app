import { Header } from 'src/components/Header/Header';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { MyChatsItem } from 'src/pages/MyChats/MyChatsItem/MyChatsItem';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';
import { useGetProfileImages } from 'src/queries/user-queries';
import { List, Typography } from 'src/ui-components';

export const MyChats = () => {
  const { currentUserChats, currentUserChatsFetching, currentUserChatsRefetch } =
    useGetCurrentUserChats();
  const { profileImages } = useGetProfileImages(
    currentUserChats?.map((x) => x.participantId) ?? [],
    {
      enabled: !currentUserChatsFetching,
    }
  );

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
            <MyChatsItem
              key={chat.id}
              chat={chat}
              imageSrc={
                profileImages?.find((x) => x.id === chat.participantId)?.profileImage ?? null
              }
            />
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
