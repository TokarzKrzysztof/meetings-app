import { Link } from 'react-router-dom';
import { User } from 'src/models/user';
import { UserActiveStatusBadge } from 'src/pages/chat/shared/components/UserActiveStatusBadge';
import { Avatar, Button, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type PrivateChatParticipantProps = {
  participant: User;
};

export const PrivateChatParticipant = ({ participant }: PrivateChatParticipantProps) => {
  return (
    <Button
      variant='text'
      color='inherit'
      component={Link}
      to={AppRoutes.UserProfile({ userId: participant.id })}
    >
      <UserActiveStatusBadge status={participant.activeStatus}>
        <Avatar src={participant.profileImageSrc} size={30} isDelete={participant.isDelete} />
      </UserActiveStatusBadge>
      <Typography ml={1} fontSize={14}>
        {participant.firstName} {participant.lastName}
      </Typography>
    </Button>
  );
};
