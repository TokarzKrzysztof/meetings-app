import { Link } from 'react-router-dom';
import { Icon, List, ListItemButton, ListItemIcon, ListItemText } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type MyProfileActionListProps = {};

export const MyProfileActionList = ({ ...props }: MyProfileActionListProps) => {
  return (
    <List sx={{ mt: 4 }} color='primary'>
      <ListItemButton component={Link} to={AppRoutes.MyProfileChangeData()}>
        <ListItemIcon>
          <Icon name='edit' />
        </ListItemIcon>
        <ListItemText primary='Edytuj dane osobowe' />
      </ListItemButton>

      <ListItemButton component={Link} to={AppRoutes.MyProfileChangePassword()}>
        <ListItemIcon>
          <Icon name='key' />
        </ListItemIcon>
        <ListItemText primary='Zmień hasło' />
      </ListItemButton>

      <ListItemButton component={Link} to={AppRoutes.MyProfileChangeEmail()}>
        <ListItemIcon>
          <Icon name='email' />
        </ListItemIcon>
        <ListItemText primary='Zmień adres email' />
      </ListItemButton>
    </List>
  );
};
