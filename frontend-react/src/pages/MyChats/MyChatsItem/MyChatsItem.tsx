import { styled } from '@mui/material';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { UserActiveStatusBadge } from 'src/components/UserActiveStatusBadge/UserActiveStatusBadge';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { MessageType } from 'src/models/chat/message';
import { UserGender } from 'src/models/user';
import { Avatar, Box, ListItemAvatar, ListItemButton, ListItemText } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

const StyledDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

export type MyChatsItemProps = {
  chat: ChatPreview;
};

export const MyChatsItem = ({ chat }: MyChatsItemProps) => {
  const currentUser = useLoggedInUser();
  const location = useLocation();

  const lastMessageText = useMemo(() => {
    if (!chat.hasLastMessage) return null;

    const isAuthorCurrentUser = currentUser.id === chat.lastMessageAuthorId;
    const prefix = isAuthorCurrentUser ? 'Ty:' : `${chat.participantFirstName}:`;
    if (chat.lastMessageType === MessageType.Text) {
      return `${prefix} ${chat.lastMessageValue}`;
    }

    const itemName = chat.lastMessageType === MessageType.Image ? 'zdjęcie' : 'wiadomość głosową';
    return isAuthorCurrentUser
      ? `${prefix} ${currentUser.gender === UserGender.Male ? 'Wysłałeś' : 'Wysłałaś'} ${itemName}`
      : `${prefix} ${
          chat.participantGender === UserGender.Male ? 'Wysłał' : 'Wysłała'
        } ${itemName}`;
  }, [chat]);

  const fontWeight = chat.hasUnreadMessages ? 'bold' : undefined;
  return (
    <ListItemButton
      component={Link}
      to={AppRoutes.PrivateChat({
        userId: chat.participantId,
        returnUrl: location.pathname + location.search,
      })}
    >
      <ListItemAvatar sx={{ minWidth: 'auto', mr: 2 }}>
        <UserActiveStatusBadge status={chat.participantActiveStatus}>
          <Avatar size={50} src={chat.participantProfileImageSrc} />
        </UserActiveStatusBadge>
      </ListItemAvatar>
      <ListItemText
        primary={`${chat.participantFirstName} ${chat.participantLastName}`}
        secondary={lastMessageText}
        primaryTypographyProps={{
          fontWeight: fontWeight,
        }}
        secondaryTypographyProps={{
          fontWeight: fontWeight,
          sx: {
            whiteSpace: 'nowrap',
            textOverflow: 'ellipsis',
            overflow: 'hidden',
          },
        }}
      />
      {chat.hasUnreadMessages && <StyledDot />}
    </ListItemButton>
  );
};
