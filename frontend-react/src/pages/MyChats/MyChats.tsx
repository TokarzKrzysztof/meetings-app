import { Header } from 'src/components/Header/Header';
import { MyChatsItem } from 'src/pages/MyChats/MyChatsItem/MyChatsItem';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';
import { useGetProfileImages } from 'src/queries/user-queries';
import { List } from 'src/ui-components';

export const MyChats = () => {
  const { currentUserChats, currentUserChatsFetching } = useGetCurrentUserChats();
  const { profileImages } = useGetProfileImages(
    currentUserChats?.map((x) => x.participantId) ?? [],
    {
      enabled: !currentUserChatsFetching,
    }
  );

  if (!currentUserChats) return null;
  return (
    <>
      <Header />
      <List>
        {currentUserChats.map((chat) => (
          <MyChatsItem
            key={chat.id}
            chat={chat}
            imageSrc={profileImages?.find((x) => x.id === chat.participantId)?.profileImage ?? null}
          />
        ))}
      </List>
    </>
  );
};

MyChats.displayName = 'MyChats';
