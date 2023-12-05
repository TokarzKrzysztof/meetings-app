import { styled } from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { ChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { MessageType } from 'src/models/chat/message';
import { UserGender } from 'src/models/user';
import { UserActiveStatusBadge } from 'src/pages/chat/shared/UserActiveStatusBadge';
import { Avatar, Box, ListItemAvatar, ListItemButton, ListItemText } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

const StyledDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

export type MyChatsListItemProps = {
  chat: ChatPreview;
};

export const MyChatsListItem = ({ chat }: MyChatsListItemProps) => {
  const currentUser = useLoggedInUser();

  const lastMessageText = useMemo(() => {
    if (!chat.hasLastMessage) return null;

    const isAuthorCurrentUser = currentUser.id === chat.lastMessageAuthorId;
    const prefix = isAuthorCurrentUser ? 'Ty:' : `${chat.lastMessageAuthorFirstName}:`;
    if (chat.lastMessageType === MessageType.Text) {
      return `${prefix} ${chat.lastMessageValue}`;
    }

    const itemName = chat.lastMessageType === MessageType.Image ? 'zdjęcie' : 'wiadomość głosową';
    return isAuthorCurrentUser
      ? `${prefix} ${currentUser.gender === UserGender.Male ? 'Wysłałeś' : 'Wysłałaś'} ${itemName}`
      : `${prefix} ${
          chat.lastMessageAuthorGender === UserGender.Male ? 'Wysłał' : 'Wysłała'
        } ${itemName}`;
  }, [chat]);

  const to = useMemo(() => {
    if (chat.type === ChatType.Private) {
      return AppRoutes.PrivateChat({ userId: chat.participantId! });
    } else {
      return AppRoutes.GroupChat({ chatId: chat.id });
    }
  }, [chat]);

  const fontWeight = chat.hasUnreadMessages ? 'bold' : undefined;
  return (
    <ListItemButton component={Link} to={to}>
      <ListItemAvatar sx={{ minWidth: 'auto', mr: 2 }}>
        <UserActiveStatusBadge status={chat.participantActiveStatus}>
          <Avatar size={50} src={chat.imageSrcs[0]} />
        </UserActiveStatusBadge>
      </ListItemAvatar>
      <ListItemText
        primary={chat.name}
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
