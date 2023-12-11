import { useMemo } from 'react';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { User } from 'src/models/user';
import { Avatar, AvatarGroup, AvatarGroupProps } from 'src/ui-components';

export type AvatarListProps = AvatarGroupProps & {
  users: User[];
  avatarSize: number;
  excludeCurrentUser?: boolean;
};

export const AvatarList = ({
  users,
  avatarSize,
  excludeCurrentUser = true,
  ...props
}: AvatarListProps) => {
  const currentUser = useLoggedInUser();

  const srcs = useMemo(() => {
    if (excludeCurrentUser) {
      return users.filter((x) => x.id !== currentUser.id).map((x) => x.profileImageSrc);
    } else {
      return users.map((x) => x.profileImageSrc);
    }
  }, [users, excludeCurrentUser]);

  return (
    <AvatarGroup
      spacing='small'
      slotProps={{ additionalAvatar: { sx: { width: avatarSize, height: avatarSize } } }}
      max={3}
      {...props}
    >
      {srcs.map((src, i) => (
        <Avatar key={i} size={avatarSize} src={src}></Avatar>
      ))}
    </AvatarGroup>
  );
};
