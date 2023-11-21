import {
  AvatarTypeMap,
  default as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material/Avatar';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';

export type AvatarProps<D extends React.ElementType = AvatarTypeMap['defaultComponent']> = Omit<
  MuiAvatarProps<D, { component?: D }>,
  'src'
> & {
  src?: string | null;
  size: number;
};

export const Avatar = <D extends React.ElementType = AvatarTypeMap['defaultComponent']>({
  size,
  src,
  sx,
  ...props
}: AvatarProps<D>) => (
  <MuiAvatar
    sx={{ width: size, height: size, ...sx }}
    src={src ?? avatarPlaceholder}
    {...props}
  ></MuiAvatar>
);
