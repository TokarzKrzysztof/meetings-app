import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import { useNavigateBack } from 'src/hooks/useNavigateBack';
import { Chat } from 'src/models/chat/chat';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useLeaveGroupChat } from 'src/queries/chat-participant-queries';
import { DialogContentText, Icon, IconButton, Menu, MenuItem } from 'src/ui-components';

export type GroupChatActionsProps = {
  groupChat: Chat;
  onShowParticipantsDialog: () => void;
  onShowChangeNameDialog: () => void;
};

export const GroupChatActions = ({
  groupChat,
  onShowParticipantsDialog,
  onShowChangeNameDialog,
}: GroupChatActionsProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const menuAnchorRef = useRef<HTMLButtonElement>(null);
  const navigateBack = useNavigateBack();
  const { leaveGroupChat } = useLeaveGroupChat();

  const handleLeaveChat = () => {
    confirm({
      message: <DialogContentText>Czy na pewno chcesz opuścić ten chat?</DialogContentText>,
      onAccept: () =>
        leaveGroupChat(groupChat.id, {
          onSuccess: navigateBack,
        }),
    });
  };

  return (
    <>
      <IconButton color='inherit' ref={menuAnchorRef}>
        <Icon name='more_vert' />
      </IconButton>
      <Menu anchorRef={menuAnchorRef}>
        <MenuItem onClick={onShowChangeNameDialog}>Zmień nazwę</MenuItem>
        <MenuItem onClick={onShowParticipantsDialog}>Uczestnicy</MenuItem>
        <MenuItem sx={(theme) => ({ color: theme.palette.error.main })} onClick={handleLeaveChat}>
          Opuść chat
        </MenuItem>
      </Menu>
    </>
  );
};
