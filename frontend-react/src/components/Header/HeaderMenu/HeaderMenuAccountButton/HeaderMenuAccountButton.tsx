import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'src/models/user';
import { Avatar, Icon, IconButton, Menu, MenuItem } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type HeaderMenuAccountButtonProps = {
  currentUser: User | null | undefined;
  onLogout: () => void;
};

export const HeaderMenuAccountButton = ({
  currentUser,
  onLogout,
}: HeaderMenuAccountButtonProps) => {
  const menuAnchorRef = useRef<HTMLButtonElement>(null);

  const menuOptions = currentUser ? (
    <>
      <MenuItem component={Link} to={AppRoutes.NewAnnouncement()} sx={{ fontWeight: 'bold' }}>
        Dodaj ogłoszenie
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.Home()}>
        Strona główna
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.MyProfile()}>
        Mój profil
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.MyAnnouncements()}>
        Moje ogłoszenia
      </MenuItem>
      <MenuItem onClick={onLogout}>Wyloguj się</MenuItem>
    </>
  ) : (
    <>
      <MenuItem component={Link} to={AppRoutes.Home()}>
        Strona główna
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.Login()}>
        Logowanie
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.Register()}>
        Rejestracja
      </MenuItem>
    </>
  );

  return (
    <>
      <IconButton color='inherit' ref={menuAnchorRef}>
        {currentUser ? (
          <Avatar src={currentUser.profileImage} size={35} />
        ) : (
          <Icon name='person_outline' />
        )}
      </IconButton>
      <Menu anchorRef={menuAnchorRef}>{menuOptions}</Menu>
    </>
  );
};
