import {
  AvatarTypeMap,
  default as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material/Avatar';

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
    src={src ?? undefined}
    {...props}
  ></MuiAvatar>
);
