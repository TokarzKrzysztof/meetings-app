import { useSnackbar } from 'notistack';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { archivedChatsTxt } from 'src/pages/chat/MyChats/MyChatsMore';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { MyChatsTitle } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsTitle';
import { useGetCurrentUserArchivedChats, useToggleArchiveChat } from 'src/queries/chat-queries';
import { MenuItem } from 'src/ui-components';

export const MyChatsArchived = () => {
  const { currentUserArchivedChats, currentUserArchivedChatsRefetch } =
    useGetCurrentUserArchivedChats();
  const { toggleArchiveChat } = useToggleArchiveChat();
  const { enqueueSnackbar } = useSnackbar();

  const handleRestore = (chat: ChatPreview) => {
    toggleArchiveChat(chat.id, {
      onSuccess: () => {
        enqueueSnackbar({
          variant: 'default',
          message: 'Rozmowa została przywrócona',
        });
        currentUserArchivedChatsRefetch();
      },
    });
  };

  if (!currentUserArchivedChats) return null;
  return (
    <>
      <MyChatsTitle title={archivedChatsTxt} />
      <MyChatsList noChatsText='Brak rozmów w archiwum'>
        {currentUserArchivedChats.map((chat) => (
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

MyChatsArchived.displayName = 'MyChatsArchived';
