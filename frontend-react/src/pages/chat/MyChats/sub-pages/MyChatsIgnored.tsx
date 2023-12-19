import { useSnackbar } from 'notistack';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { ignoredChatsTxt } from 'src/pages/chat/MyChats/MyChatsMore';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { MyChatsTitle } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsTitle';
import { useGetCurrentUserIgnoredChats, useToggleIgnoreChat } from 'src/queries/chat-queries';
import { MenuItem } from 'src/ui-components';

export const MyChatsIgnored = () => {
  const { currentUserIgnoredChats, currentUserIgnoredChatsRefetch } =
    useGetCurrentUserIgnoredChats();
  const { toggleIgnoreChat } = useToggleIgnoreChat();
  const { enqueueSnackbar } = useSnackbar();

  const handleRestore = (chat: ChatPreview) => {
    toggleIgnoreChat(chat.id, {
      onSuccess: () => {
        enqueueSnackbar({
          variant: 'default',
          message: 'Rozmowa została przywrócona',
        });
        currentUserIgnoredChatsRefetch();
      },
    });
  };

  if (!currentUserIgnoredChats) return null;
  return (
    <>
      <MyChatsTitle title={ignoredChatsTxt} />
      <MyChatsList noChatsText='Brak ignorowanych rozmów'>
        {currentUserIgnoredChats.map((chat) => (
          <MyChatsListItem
            key={chat.id}
            chat={chat}
            menuItems={
              <>
                <MenuItem onClick={() => handleRestore(chat)}>Przywróć</MenuItem>
              </>
            }
          />
        ))}
      </MyChatsList>
    </>
  );
};

MyChatsIgnored.displayName = 'MyChatsIgnored';
