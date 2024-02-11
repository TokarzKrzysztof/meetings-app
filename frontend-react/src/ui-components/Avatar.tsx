import {
  AvatarTypeMap,
  default as MuiAvatar,
  AvatarProps as MuiAvatarProps,
} from '@mui/material/Avatar';
import { Icon } from 'src/ui-components/Icon';

export type AvatarProps<D extends React.ElementType = AvatarTypeMap['defaultComponent']> = Omit<
  MuiAvatarProps<D, { component?: D }>,
  'src'
> & {
  size: number;
  src?: string | null;
  isDelete?: boolean;
};

export const Avatar = <D extends React.ElementType = AvatarTypeMap['defaultComponent']>({
  size,
  src,
  isDelete,
  sx,
  ...props
}: AvatarProps<D>) => {
  return (
    <MuiAvatar
      sx={{ width: size, height: size, opacity: isDelete ? 0.5 : 1, ...sx }}
      src={src ?? undefined}
      {...props}
    >
      {/* must be undefined, otherwise person icon won`t be displayed */}
      {isDelete ? <Icon name='close' sx={{ fontSize: size }} /> : undefined}
    </MuiAvatar>
  );
};
