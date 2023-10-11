import { useAtom } from 'jotai';
import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuthLogout } from 'src/queries/auth-queries';
import { currentUserAtom } from 'src/store/store';
import { Box, Icon, IconButton, Menu, MenuItem } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuButtonProps = {};

export const HeaderMenuButton = ({ ...props }: HeaderMenuButtonProps) => {
  const [currentUser, setCurrentUser] = useAtom(currentUserAtom);
  const { logout } = useAuthLogout();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout(undefined, {
      onSuccess: () => {
        setCurrentUser(null);
      },
    });
  };

  const menuOptions = currentUser ? (
    <>
      <MenuItem
        component={Link}
        to={AppRoutes.Home}
        sx={{ fontWeight: 'bold' }}
      >
        Dodaj ogłoszenie
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.Home}>
        Moje konto
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.Home}>
        Wiadomości
      </MenuItem>
      <MenuItem onClick={handleLogout}>
        Wyloguj się
      </MenuItem>
    </>
  ) : (
    <>
      <MenuItem component={Link} to={AppRoutes.Login}>
        Logowanie
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.Register}>
        Rejestracja
      </MenuItem>
    </>
  );

  return (
    <>
      <IconButton
        size='large'
        slot='end'
        color='inherit'
        aria-label='menu'
        onClick={handleOpen}
      >
        <Icon name={'person_outline'} />
      </IconButton>
      <Menu
        id='basic-menu'
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        <Box onClick={handleClose}>{menuOptions}</Box>
      </Menu>
    </>
  );
};
