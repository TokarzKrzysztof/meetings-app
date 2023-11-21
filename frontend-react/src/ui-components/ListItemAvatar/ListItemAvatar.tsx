import {
  default as MuiListItemAvatar,
  ListItemAvatarProps as MuiListItemAvatarProps,
} from '@mui/material/ListItemAvatar';

export type ListItemAvatarProps = MuiListItemAvatarProps & {};

export const ListItemAvatar = ({ ...props }: ListItemAvatarProps) => (
  <MuiListItemAvatar {...props}></MuiListItemAvatar>
);
