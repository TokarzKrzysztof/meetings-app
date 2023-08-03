import {
  default as MuiMenu,
  MenuProps as MuiMenuProps,
} from '@mui/material/Menu';
import { styled } from '@mui/material/styles';

const StyledMenu = styled(MuiMenu)({
  '& .MuiList-root': {
    padding: 0,
  },
  '& .MuiMenuItem-root': {
    fontSize: 13,
  },
});

export type MenuProps = {};

export const Menu = ({ ...props }: MuiMenuProps & MenuProps) => (
  <StyledMenu {...props}></StyledMenu>
);
