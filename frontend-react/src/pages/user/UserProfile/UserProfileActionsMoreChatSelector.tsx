import { useSetAtom } from 'jotai';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FullscreenDialog } from 'src/components/FullscreenDialog';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { UserChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { UserGender } from 'src/models/user';
import { UserProfile } from 'src/models/user-profile';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useAddGroupChatParticipant } from 'src/queries/chat-participant-queries';
import { useGetCurrentUserChats } from 'src/queries/chat-queries';
import { DialogContentText, List, ListItemButton, ListItemText } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type UserProfileActionsMoreChatSelectorProps = {
  userProfile: UserProfile;
  open: boolean;
  onClose: () => void;
};

export const UserProfileActionsMoreChatSelector = ({
  userProfile,
  open,
  onClose,
}: UserProfileActionsMoreChatSelectorProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const currentUser = useLoggedInUser();
  const navigate = useNavigate();
  const [selectedChat, setSelectedChat] = useState<ChatPreview | null>(null);
  const { currentUserChats } = useGetCurrentUserChats(UserChatType.Group, { enabled: open });
  const { addGroupChatParticipant } = useAddGroupChatParticipant();

  useEffect(() => {
    if (open) {
      setSelectedChat(null);
    }
  }, [open]);

  const handleSave = () => {
    const participant = userProfile.user;
    confirm({
      message: (
        <DialogContentText>
          Czy dodać użytkownika{' '}
          <b>
            {participant.firstName} {participant.lastName}
          </b>{' '}
          do rozmowy <b>{selectedChat!.name}</b>? <br />
          Zobaczy {participant.gender === UserGender.Male ? 'on' : 'ona'} wszystkie poprzednie
          wiadomości.
        </DialogContentText>
      ),
      onAccept: () => {
        addGroupChatParticipant(
          { chatId: selectedChat!.id, userId: participant.id },
          {
            onSuccess: () => navigate(AppRoutes.GroupChat({ chatId: selectedChat!.id })),
          }
        );
      },
    });
  };

  const displayedItems = useMemo(() => {
    if (!currentUserChats) return [];
    return currentUserChats
      .filter((x) => {
        const ids = x.participants.map((p) => p.id);
        return !ids.includes(userProfile.user.id);
      })
      .map((x) => {
        const names = x.participants.filter((x) => x.id !== currentUser.id).map((x) => x.firstName);
        const namesString = names.length ? ['Ty', ...names].join(', ') : 'Tylko Ty';

        return { ...x, secondary: namesString };
      });
  }, [currentUserChats]);

  return (
    <FullscreenDialog
      open={open}
      onClose={onClose}
      saveDisabled={selectedChat === null}
      saveButtonText={'DODAJ'}
      onSave={handleSave}
    >
      <List>
        {displayedItems.map((x) => (
          <ListItemButton
            key={x.id}
            selected={selectedChat?.id === x.id}
            onClick={() => setSelectedChat(x)}
          >
            <ListItemText primary={x.name} secondary={x.secondary} />
          </ListItemButton>
        ))}
      </List>
    </FullscreenDialog>
  );
};
