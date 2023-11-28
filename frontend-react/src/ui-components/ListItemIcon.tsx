import {
  default as MuiListItemIcon,
  ListItemIconProps as MuiListItemIconProps,
} from '@mui/material/ListItemIcon';

export type ListItemIconProps = MuiListItemIconProps & {};

export const ListItemIcon = ({ ...props }: ListItemIconProps) => (
  <MuiListItemIcon {...props}></MuiListItemIcon>
);
