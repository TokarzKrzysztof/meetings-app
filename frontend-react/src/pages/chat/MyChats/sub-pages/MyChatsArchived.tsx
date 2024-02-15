import { useSnackbar } from 'notistack';
import { UserChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { archivedChatsTxt } from 'src/pages/chat/MyChats/MyChatsMore';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { MyChatsTitle } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsTitle';
import { useToggleArchiveChat } from 'src/queries/chat-queries';
import { MenuItem } from 'src/ui-components';

export const MyChatsArchived = () => {
  const { toggleArchiveChat } = useToggleArchiveChat();
  const { enqueueSnackbar } = useSnackbar();

  const handleRestore = (chat: ChatPreview, refetch: () => void) => {
    toggleArchiveChat(chat.id, {
      onSuccess: () => {
        enqueueSnackbar({
          variant: 'default',
          message: 'Rozmowa została przywrócona',
        });
        refetch();
      },
    });
  };

  return (
    <>
      <MyChatsTitle title={archivedChatsTxt} />
      <MyChatsList
        noChatsText='Brak rozmów w archiwum'
        type={UserChatType.Archived}
        renderItem={(chat, refetch) => (
          <MyChatsListItem
            key={chat.id}
            chat={chat}
            menuItems={
              <>
                <MenuItem onClick={() => handleRestore(chat, refetch)}>Przywróć</MenuItem>
              </>
            }
          />
        )}
      ></MyChatsList>
    </>
  );
};

MyChatsArchived.displayName = 'MyChatsArchived';
