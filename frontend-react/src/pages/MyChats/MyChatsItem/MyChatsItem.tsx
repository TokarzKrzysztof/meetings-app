import { styled } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import { UserActiveStatusBadge } from 'src/components/UserActiveStatusBadge/UserActiveStatusBadge';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { ChatPreview } from 'src/models/chat/chat-preview';
import {
  Avatar,
  Box,
  ListItemAvatar,
  ListItemButton,
  ListItemText
} from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

const StyledDot = styled(Box)(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.primary.main,
}));

export type MyChatsItemProps = {
  chat: ChatPreview;
  imageSrc: string | null;
};

export const MyChatsItem = ({ chat, imageSrc }: MyChatsItemProps) => {
  const currentUser = useLoggedInUser();
  const location = useLocation();

  const prefix = currentUser.id === chat.lastMessageAuthorId ? 'Ty:' : '';
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
          <Avatar size={50} src={imageSrc} />
        </UserActiveStatusBadge>
      </ListItemAvatar>
      <ListItemText
        primary={chat.participantName}
        secondary={`${prefix} ${chat.lastMessageText}`}
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
