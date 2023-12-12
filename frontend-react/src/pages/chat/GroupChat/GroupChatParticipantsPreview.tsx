import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { Chat } from 'src/models/chat/chat';
import { Avatar, List, ListItem, ListItemAvatar, ListItemText, Popover } from 'src/ui-components';

export type GroupChatParticipantsPreviewProps = {
  anchorEl: HTMLDivElement | null;
  onClose: () => void;
  groupChat: Chat;
};

export const GroupChatParticipantsPreview = ({
  anchorEl,
  onClose,
  groupChat,
}: GroupChatParticipantsPreviewProps) => {
  const currentUser = useLoggedInUser();

  return (
    <Popover
      open
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <List>
        <ListItem>
          <ListItemText primary={`${groupChat.participants.length} członków`} />
        </ListItem>
        {groupChat.participants.map((x) => (
          <ListItem key={x.id}>
            <ListItemAvatar sx={{ minWidth: 'auto', mr: 1 }}>
              <Avatar size={30} src={x.profileImageSrc}></Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={x.id === currentUser.id ? 'Ty' : `${x.firstName} ${x.lastName}`}
            />
          </ListItem>
        ))}
      </List>
    </Popover>
  );
};
