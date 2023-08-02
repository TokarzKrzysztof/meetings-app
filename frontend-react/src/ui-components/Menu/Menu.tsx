import {
  default as MuiMenu,
  MenuProps as MuiMenuProps,
} from '@mui/material/Menu';

export type MenuProps = {};

export const Menu = ({ ...props }: MuiMenuProps & MenuProps) => (
  <MuiMenu {...props}></MuiMenu>
);
