import { Link, useLocation } from 'react-router-dom';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { Avatar, ListItemAvatar, ListItemButton, ListItemText } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type MyChatsItemProps = {
  chat: ChatPreview;
  imageSrc: string | null;
};

export const MyChatsItem = ({ chat, imageSrc }: MyChatsItemProps) => {
  const currentUser = useLoggedInUser();
  const location = useLocation();

  const prefix = currentUser.id === chat.lastMessageAuthorId ? 'Ty:' : '';
  return (
    <ListItemButton
      component={Link}
      to={AppRoutes.PrivateChat({
        userId: chat.participantId,
        returnUrl: location.pathname + location.search,
      })}
    >
      <ListItemAvatar sx={{ minWidth: 'auto', mr: 2 }}>
        <Avatar size={50} src={imageSrc} />
      </ListItemAvatar>
      <ListItemText
        primary={chat.participantName}
        secondary={`${prefix} ${chat.lastMessageText}`}
        secondaryTypographyProps={{
          sx: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        }}
      />
    </ListItemButton>
  );
};
