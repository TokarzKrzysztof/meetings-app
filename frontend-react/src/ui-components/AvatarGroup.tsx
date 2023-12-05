import {
  default as MuiAvatarGroup,
  AvatarGroupProps as MuiAvatarGroupProps,
} from '@mui/material/AvatarGroup';

export type AvatarGroupProps = MuiAvatarGroupProps & {};

export const AvatarGroup = ({ ...props }: AvatarGroupProps) => (
  <MuiAvatarGroup {...props}></MuiAvatarGroup>
);
