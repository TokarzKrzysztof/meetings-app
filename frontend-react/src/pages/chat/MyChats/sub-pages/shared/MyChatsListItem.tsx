import { styled } from '@mui/material';
import { ReactElement, useMemo, useRef } from 'react';
import { Link } from 'react-router-dom';
import { AvatarList } from 'src/components/AvatarList';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { ChatType } from 'src/models/chat/chat';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { MessageType } from 'src/models/chat/message';
import { UserGender } from 'src/models/user';
import { UserActiveStatusBadge } from 'src/pages/chat/shared/components/UserActiveStatusBadge';
import {
  Box,
  Icon,
  IconButton,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Menu,
  Stack,
} from 'src/ui-components';
import { withNoPropagation } from 'src/utils/dom-utils';
import { AppRoutes } from 'src/utils/enums/app-routes';

const StyledDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

export type MyChatsListItemProps = {
  chat: ChatPreview;
  menuItems?: ReactElement;
};

export const MyChatsListItem = ({ menuItems, chat }: MyChatsListItemProps) => {
  const currentUser = useLoggedInUser();
  const menuAnchorRef = useRef<HTMLButtonElement>(null);

  const getPrivateChatParticipant = () => {
    return chat.participants.find((x) => x.id !== currentUser.id)!;
  };

  const lastMessageText = useMemo(() => {
    const lastMessage = chat.lastMessage;

    const isAuthorCurrentUser = currentUser.id === lastMessage.authorId;
    const prefix = isAuthorCurrentUser ? 'Ty:' : `${chat.lastMessageAuthor.firstName}:`;
    if (lastMessage.type === MessageType.Text) {
      return `${prefix} ${lastMessage.value}`;
    }
    if (lastMessage.type === MessageType.Info) {
      return lastMessage.value;
    }

    const itemName = lastMessage.type === MessageType.Image ? 'zdjęcie' : 'wiadomość głosową';
    return isAuthorCurrentUser
      ? `${prefix} ${currentUser.gender === UserGender.Male ? 'Wysłałeś' : 'Wysłałaś'} ${itemName}`
      : `${prefix} ${
          chat.lastMessageAuthor.gender === UserGender.Male ? 'Wysłał' : 'Wysłała'
        } ${itemName}`;
  }, [chat]);

  const to = useMemo(() => {
    if (chat.type === ChatType.Group) return AppRoutes.GroupChat({ chatId: chat.id });
    return AppRoutes.PrivateChat({ userId: getPrivateChatParticipant().id });
  }, [chat]);

  const activeStatus = useMemo(() => {
    if (chat.type === ChatType.Group) return null;
    return getPrivateChatParticipant().activeStatus;
  }, [chat]);

  const chatName = useMemo(() => {
    if (chat.type === ChatType.Group) return chat.name;
    const participant = getPrivateChatParticipant();
    return `${participant.firstName} ${participant.lastName}`;
  }, [chat]);

  const fontWeight = chat.hasUnreadMessages ? 'bold' : undefined;
  return (
    <>
      <ListItemButton component={Link} to={to}>
        <ListItemAvatar sx={{ minWidth: 'auto', mr: 2 }}>
          <UserActiveStatusBadge status={activeStatus}>
            <AvatarList users={chat.participants} avatarSize={'large'} />
          </UserActiveStatusBadge>
        </ListItemAvatar>
        <ListItemText
          primary={chatName}
          secondary={lastMessageText}
          primaryTypographyProps={{
            fontWeight: fontWeight,
            sx: {
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              overflow: 'hidden',
            },
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
        <Stack gap={1} alignItems={'center'}>
          {chat.hasUnreadMessages && <StyledDot />}
          {menuItems && (
            <IconButton ref={menuAnchorRef} {...withNoPropagation()}>
              <Icon name='more_vert' />
            </IconButton>
          )}
        </Stack>
      </ListItemButton>
      {menuItems && <Menu anchorRef={menuAnchorRef}>{menuItems}</Menu>}
    </>
  );
};
