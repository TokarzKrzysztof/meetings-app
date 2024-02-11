import { User } from 'src/models/user';
import { UserActiveStatusBadge } from 'src/pages/chat/shared/components/UserActiveStatusBadge';
import { Avatar, Icon } from 'src/ui-components';

export type UserAvatarProps = {
  user: User;
  size: number;
};

export const UserAvatar = ({ user, size }: UserAvatarProps) => {
  return (
    <UserActiveStatusBadge status={user.activeStatus}>
       <Avatar
          key={user.id}
          size={size}
          src={user.profileImageSrc}
          sx={{ opacity: user.isDelete ? 0.5 : 1 }}
        >
          {user.isDelete && <Icon name='close' fontSize={'large'} />}
        </Avatar>
    </UserActiveStatusBadge>
  );
};
