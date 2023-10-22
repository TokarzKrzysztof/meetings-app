import {
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from 'src/ui-components';

export type MyProfileActionListProps = {};

export const MyProfileActionList = ({ ...props }: MyProfileActionListProps) => {
  return (
    <List sx={{ mt: 4 }} color='primary'>
      <ListItemButton>
        <ListItemIcon>
          <Icon name='edit' />
        </ListItemIcon>
        <ListItemText primary='Edytuj dane osobowe' />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <Icon name='key' />
        </ListItemIcon>
        <ListItemText primary='Zmień hasło' />
      </ListItemButton>

      <ListItemButton>
        <ListItemIcon>
          <Icon name='email' />
        </ListItemIcon>
        <ListItemText primary='Zmień adres email' />
      </ListItemButton>
    </List>
  );
};
