import {
  MenuItemTypeMap,
  default as MuiMenuItem,
  MenuItemProps as MuiMenuItemProps,
} from '@mui/material/MenuItem';

export type MenuItemProps = {};

export const MenuItem = <
  D extends React.ElementType = MenuItemTypeMap['defaultComponent']
>({
  ...props
}: MuiMenuItemProps<D, { component?: D }> & MenuItemProps) => (
  <MuiMenuItem {...props}></MuiMenuItem>
);
