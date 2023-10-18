import { MouseEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { User } from 'src/models/user';
import {
  Avatar,
  Box,
  Icon,
  IconButton,
  Menu,
  MenuItem,
} from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuAccountButtonProps = {
  currentUser: User | null | undefined;
  onLogout: () => void;
};

export const HeaderMenuAccountButton = ({
  currentUser,
  onLogout,
}: HeaderMenuAccountButtonProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleOpen = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const menuOptions = currentUser ? (
    <>
      <MenuItem
        component={Link}
        to={AppRoutes.NewAnnouncement}
        sx={{ fontWeight: 'bold' }}
      >
        Dodaj ogłoszenie
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.MyProfile}>
        Mój profil
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.MyAnnouncements}>
        Moje ogłoszenia
      </MenuItem>
      <MenuItem onClick={onLogout}>Wyloguj się</MenuItem>
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
      <IconButton color='inherit' onClick={handleOpen}>
        {currentUser ? (
          <Avatar src={avatarPlaceholder} sx={{ width: 35, height: 35 }} />
        ) : (
          <Icon name={'person_outline'} />
        )}
      </IconButton>
      <Menu anchorEl={anchorEl} open={!!anchorEl} onClose={handleClose}>
        <Box onClick={handleClose}>{menuOptions}</Box>
      </Menu>
    </>
  );
};
