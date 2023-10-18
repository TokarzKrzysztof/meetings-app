import {
  AvatarTypeMap,
  default as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material/Avatar';

export type AvatarProps<
  D extends React.ElementType = AvatarTypeMap['defaultComponent']
> = MuiAvatarProps<D, { component?: D }> & {};

export const Avatar = <
  D extends React.ElementType = AvatarTypeMap['defaultComponent']
>({
  ...props
}: AvatarProps<D>) => <MuiAvatar {...props}></MuiAvatar>;
