import { useSetAtom } from 'jotai';
import { UsersHttpAutocomplete } from 'src/components/UsersHttpAutocomplete';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Chat } from 'src/models/chat/chat';
import { User, UserGender } from 'src/models/user';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import {
  useAddGroupChatParticipant,
  useRemoveGroupChatParticipant,
} from 'src/queries/chat-participant-queries';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Icon,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Typography,
} from 'src/ui-components';

export type GroupChatParticipantsProps = {
  onClose: () => void;
  onReload: () => void;
  groupChat: Chat;
};

export const GroupChatParticipants = ({
  onClose,
  onReload,
  groupChat,
}: GroupChatParticipantsProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const currentUser = useLoggedInUser();
  const { addGroupChatParticipant } = useAddGroupChatParticipant();
  const { removeGroupChatParticipant } = useRemoveGroupChatParticipant();

  const handleRemoveParticipant = (participant: User) => {
    confirm({
      message: (
        <DialogContentText>
          Czy chcesz usunąć użytkownika{' '}
          <b>
            {participant.firstName} {participant.lastName}
          </b>{' '}
          z rozmowy?
        </DialogContentText>
      ),
      onAccept: () => {
        removeGroupChatParticipant(
          { chatId: groupChat.id, userId: participant.id },
          {
            onSuccess: () => onReload(),
          }
        );
      },
    });
  };

  const handleAddParticipant = (participant: User) => {
    if (groupChat.participants.some((x) => x.id === participant.id)) return;

    confirm({
      message: (
        <DialogContentText>
          Czy dodać użytkownika{' '}
          <b>
            {participant.firstName} {participant.lastName}
          </b>{' '}
          do rozmowy? <br />
          Zobaczy {participant.gender === UserGender.Male ? 'on' : 'ona'} wszystkie poprzednie
          wiadomości.
        </DialogContentText>
      ),
      onAccept: () => {
        addGroupChatParticipant(
          { chatId: groupChat.id, userId: participant.id },
          {
            onSuccess: () => onReload(),
          }
        );
      },
    });
  };

  return (
    <Dialog
      open
      PaperProps={{
        sx: { m: 0, maxWidth: 500, width: '95%' },
      }}
    >
      <Box textAlign='right'>
        <IconButton onClick={onClose}>
          <Icon name='close'></Icon>
        </IconButton>
      </Box>
      <DialogContent sx={{ py: 0 }}>
        <Box mb={5}>
          <Typography mb={1}>Dodaj uczestników</Typography>
          <UsersHttpAutocomplete onSelectUser={handleAddParticipant} />
        </Box>
        <List>
          <ListItem disableGutters>
            <ListItemText primary={`${groupChat.participants.length} członków`} />
          </ListItem>
          {groupChat.participants.map((x) => {
            const isCurrentUser = currentUser.id === x.id;
            return (
              <ListItem
                disableGutters
                key={x.id}
                secondaryAction={
                  isCurrentUser ? null : (
                    <IconButton aria-label='comment' onClick={() => handleRemoveParticipant(x)}>
                      <Icon name='delete' />
                    </IconButton>
                  )
                }
              >
                <ListItemAvatar>
                  <Avatar src={x.profileImageSrc} size={30} />
                </ListItemAvatar>
                <ListItemText primary={isCurrentUser ? 'Ty' : `${x.firstName} ${x.lastName}`} />
              </ListItem>
            );
          })}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='text'>
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};
