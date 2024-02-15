import { useSnackbar } from 'notistack';
import { UserChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { ignoredChatsTxt } from 'src/pages/chat/MyChats/MyChatsMore';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { MyChatsTitle } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsTitle';
import { useToggleIgnoreChat } from 'src/queries/chat-queries';
import { MenuItem } from 'src/ui-components';

export const MyChatsIgnored = () => {
  const { toggleIgnoreChat } = useToggleIgnoreChat();
  const { enqueueSnackbar } = useSnackbar();

  const handleRestore = (chat: ChatPreview, refetch: () => void) => {
    toggleIgnoreChat(chat.id, {
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
      <MyChatsTitle title={ignoredChatsTxt} />
      <MyChatsList
        noChatsText='Brak ignorowanych rozmów'
        type={UserChatType.Ignored}
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

MyChatsIgnored.displayName = 'MyChatsIgnored';
