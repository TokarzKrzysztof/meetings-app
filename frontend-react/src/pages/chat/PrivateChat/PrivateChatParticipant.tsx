import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'src/models/user';
import { UserActiveStatusBadge } from 'src/pages/chat/shared/components/UserActiveStatusBadge';
import { Avatar, Menu, MenuItem, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type PrivateChatParticipantProps = {
  participant: User;
};

export const PrivateChatParticipant = ({ participant }: PrivateChatParticipantProps) => {
  const menuAnchorRef = useRef<HTMLDivElement>(null);

  return (
    <>
      <Stack role='button' alignItems='center' gap={1} ref={menuAnchorRef}>
        <UserActiveStatusBadge status={participant.activeStatus}>
          <Avatar src={participant.profileImageSrc} size={30} isDelete={participant.isDelete} />
        </UserActiveStatusBadge>
        <Typography>
          {participant.firstName} {participant.lastName}
        </Typography>
      </Stack>
      <Menu anchorRef={menuAnchorRef}>
        <MenuItem component={Link} to={AppRoutes.UserProfile({ userId: participant.id })}>
          Wyświetl profil
        </MenuItem>
      </Menu>
    </>
  );
};
