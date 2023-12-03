import { Header } from 'src/components/header/Header';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { MyChatsNewPrivateMessage } from 'src/pages/chat/MyChats/MyChatsNewPrivateMessage';
import { MyChatsTabs } from 'src/pages/chat/MyChats/MyChatsTabs';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';
import { Box } from 'src/ui-components';

export const MyChats = () => {
  const { currentUserChats, currentUserChatsRefetch } = useGetCurrentUserChats();

  useSignalREffect('onGetNewMessage', () => {
    currentUserChatsRefetch();
  });

  if (!currentUserChats) return null;
  return (
    <>
      <Header />
      <Box position={'relative'}>
        {currentUserChats.length && <MyChatsTabs currentUserChats={currentUserChats} />}
        <MyChatsNewPrivateMessage />
      </Box>
    </>
  );
};

MyChats.displayName = 'MyChats';
