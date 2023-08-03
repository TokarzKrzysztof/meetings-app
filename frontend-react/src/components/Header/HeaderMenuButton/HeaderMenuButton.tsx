import { MouseEvent, useState } from 'react';
import { Icon, IconButton, Menu, MenuItem } from 'src/ui-components';
import { Link } from 'src/ui-components/Link/Link';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuButtonProps = {};

export const HeaderMenuButton = ({ ...props }: HeaderMenuButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <IconButton
        size='large'
        slot='end'
        color='inherit'
        aria-label='menu'
        onClick={handleClick}
      >
        <Icon name={'menu'} />
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose} component={Link} to={AppRoutes.Login}>
          Logowanie
        </MenuItem>
        <MenuItem
          onClick={handleClose}
          component={Link}
          to={AppRoutes.Register}
        >
          Rejestracja
        </MenuItem>
      </Menu>
    </>
  );
};
