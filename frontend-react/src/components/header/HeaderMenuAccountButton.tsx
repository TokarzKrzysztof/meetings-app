import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'src/models/user';
import {
  Avatar,
  Icon,
  IconButton,
  ListItemIcon,
  ListItemText,
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
  const menuAnchorRef = useRef<HTMLButtonElement>(null);

  const menuOptions = currentUser ? (
    <>
      <MenuItem component={Link} to={AppRoutes.NewAnnouncement()} sx={{ fontWeight: 'bold' }}>
        <ListItemIcon>
          <Icon name={'campaign'} />
        </ListItemIcon>
        <ListItemText>Dodaj ogłoszenie</ListItemText>
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.MyAnnouncements()}>
        <ListItemIcon>
          <Icon name={'list'} />
        </ListItemIcon>
        <ListItemText>Moje ogłoszenia</ListItemText>
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.UserProfile({ userId: currentUser.id })}>
        <ListItemIcon>
          <Icon name={'person'} />
        </ListItemIcon>
        <ListItemText>Mój profil</ListItemText>
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.MyProfile()}>
        <ListItemIcon>
          <Icon name={'settings'} />
        </ListItemIcon>
        <ListItemText>Ustawienia</ListItemText>
      </MenuItem>
      <MenuItem onClick={onLogout}>
        <ListItemIcon>
          <Icon name={'logout'} />
        </ListItemIcon>
        <ListItemText>Wyloguj się</ListItemText>
      </MenuItem>
    </>
  ) : (
    <>
      <MenuItem component={Link} to={AppRoutes.Login()}>
        <ListItemIcon>
          <Icon name={'login'} />
        </ListItemIcon>
        <ListItemText>Logowanie</ListItemText>
      </MenuItem>
      <MenuItem component={Link} to={AppRoutes.Register()}>
        <ListItemIcon>
          <Icon name={'person_add'} />
        </ListItemIcon>
        <ListItemText>Rejestracja</ListItemText>
      </MenuItem>
    </>
  );

  return (
    <>
      <IconButton color='inherit' ref={menuAnchorRef}>
        {currentUser ? (
          <Avatar src={currentUser.profileImageSrc} size={35} />
        ) : (
          <Icon name='person_outline' />
        )}
      </IconButton>
      <Menu anchorRef={menuAnchorRef}>{menuOptions}</Menu>
    </>
  );
};
