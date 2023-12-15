import { useSetAtom } from 'jotai';
import { Link } from 'react-router-dom';
import { useSignalREffect } from 'src/hooks/signalR/useSignalREffect';
import { ChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { MyChatsListItem } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsListItem';
import { MyChatsPanel } from 'src/pages/chat/MyChats/sub-pages/shared/MyChatsPanel';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useGetCurrentUserChats, useLeaveGroupChat } from 'src/queries/chat-queries';
import { MenuItem } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const MyChatsGroup = () => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const { currentUserChats, currentUserChatsRefetch } = useGetCurrentUserChats(ChatType.Group);
  const { leaveGroupChat } = useLeaveGroupChat();

  const handleConfirmLeaveChat = (chat: ChatPreview) => {
    confirm({
      message: (
        <>
          Czy na pewno chcesz opuścić chat <b>{chat.name}</b> ?
        </>
      ),
      onAccept: () => handleLeaveChat(chat),
    });
  };
  const handleLeaveChat = (chat: ChatPreview) => {
    leaveGroupChat(chat.id, {
      onSuccess: () => currentUserChatsRefetch(),
    });
  };

  useSignalREffect('onGetNewMessage', () => {
    currentUserChatsRefetch();
  });

  if (!currentUserChats) return null;
  return (
    <MyChatsPanel noChatsText='Brak grupowych rozmów'>
      {currentUserChats.map((chat) => (
        <MyChatsListItem
          key={chat.id}
          chat={chat}
          menuItems={
            <>
              <MenuItem component={Link} to={AppRoutes.EditGroupChat({ chatId: chat.id })}>
                Edytuj
              </MenuItem>
              <MenuItem
                sx={(theme) => ({ color: theme.palette.error.main })}
                onClick={() => handleConfirmLeaveChat(chat)}
              >
                Opuść chat
              </MenuItem>
            </>
          }
        />
      ))}
    </MyChatsPanel>
  );
};

MyChatsGroup.displayName = 'MyChatsGroup';
