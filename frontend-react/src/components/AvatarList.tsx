import { useMemo } from 'react';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { User } from 'src/models/user';
import { Avatar, AvatarGroup, AvatarGroupProps } from 'src/ui-components';

export type AvatarListProps = AvatarGroupProps & {
  users: User[];
  avatarSize: 'large' | 'small';
};

export const AvatarList = ({ users, avatarSize, ...props }: AvatarListProps) => {
  const currentUser = useLoggedInUser();

  const { size, additionalAvatarFontSize, additionalAvatarMarginLeft } = useMemo(() => {
    if (avatarSize === 'large') {
      return {
        size: 50,
        additionalAvatarMarginLeft: -15,
        additionalAvatarFontSize: undefined,
      };
    } else {
      return {
        size: 30,
        additionalAvatarMarginLeft: -8,
        additionalAvatarFontSize: 14,
      };
    }
  }, [avatarSize]);

  const data = useMemo(() => {
    return users.filter((x) => x.id !== currentUser.id);
  }, [users]);
  return (
    <AvatarGroup
      spacing='small'
      slotProps={{
        additionalAvatar: {
          sx: { width: size, height: size },
          style: { marginLeft: additionalAvatarMarginLeft, fontSize: additionalAvatarFontSize },
        },
      }}
      max={3}
      {...props}
    >
      {data.map((user) => (
        <Avatar
          key={user.id}
          size={size}
          src={user.profileImageSrc}
          isDelete={user.isDelete}
        ></Avatar>
      ))}
    </AvatarGroup>
  );
};
