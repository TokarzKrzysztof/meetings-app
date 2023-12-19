import { useSetAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { MyChatsItemCommonActions } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsItemCommonActions';
import { MyChatsList } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsList';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useGetCurrentUserGroupChats, useLeaveGroupChat } from 'src/queries/chat-queries';
import { MenuItem } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const MyChatsGroup = () => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const { currentUserGroupChats, currentUserGroupChatsRefetch } = useGetCurrentUserGroupChats();
  const { leaveGroupChat } = useLeaveGroupChat();

  const handleLeaveChat = (chat: ChatPreview) => {
    confirm({
      message: (
        <>
          Czy na pewno chcesz opuścić chat <b>{chat.name}</b> ?
        </>
      ),
      onAccept: () =>
        leaveGroupChat(chat.id, {
          onSuccess: () => currentUserGroupChatsRefetch(),
        }),
    });
  };

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
            <>
              <MyChatsItemCommonActions chat={chat} onReload={currentUserGroupChatsRefetch} />
              <MenuItem component={Link} to={AppRoutes.EditGroupChat({ chatId: chat.id })}>
                Edytuj
              </MenuItem>
              <MenuItem
                sx={(theme) => ({ color: theme.palette.error.main })}
                onClick={() => handleLeaveChat(chat)}
              >
                Opuść chat
              </MenuItem>
            </>
          }
        />
      ))}
    </MyChatsList>
  );
};

MyChatsGroup.displayName = 'MyChatsGroup';
