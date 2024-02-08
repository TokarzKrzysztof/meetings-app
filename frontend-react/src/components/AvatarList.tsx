import { useMemo } from 'react';
import { useLoggedInUser } from 'src/hooks/useLoggedInUser';
import { User } from 'src/models/user';
import { Avatar, AvatarGroup, AvatarGroupProps } from 'src/ui-components';

export type AvatarListProps = AvatarGroupProps & {
  users: User[];
  avatarSize: 'large' | 'small';
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
      {srcs.map((src, i) => (
        <Avatar key={i} size={size} src={src}></Avatar>
      ))}
    </AvatarGroup>
  );
};
