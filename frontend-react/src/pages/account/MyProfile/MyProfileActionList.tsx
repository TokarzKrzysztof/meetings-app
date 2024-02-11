import { useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { Link } from 'react-router-dom';
import { User, UserGender } from 'src/models/user';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useRemoveAccount } from 'src/queries/auth-queries';
import {
  DialogContentText,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type MyProfileActionListProps = {
  currentUser: User;
};

export const MyProfileActionList = ({ currentUser }: MyProfileActionListProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const { removeAccount } = useRemoveAccount();
  const { enqueueSnackbar } = useSnackbar();

  const handleRemoveAccount = () => {
    confirm({
      message: (
        <DialogContentText component={'div'}>
          Czy na pewno chcesz usunąć swoje konto?
          <ul style={{ paddingLeft: 16 }}>
            <li>
              Nie będziesz {currentUser.gender === UserGender.Male ? 'miał' : 'miała'} już dostępu
              do tego konta
            </li>
            <li>Wszystkie Twoje ogłoszenia zostaną usunięte</li>
            <li>
              Zostaniesz {currentUser.gender === UserGender.Male ? 'usunięty' : 'usunięta'} ze
              wszystkich rozmów grupowych, natomiast wcześniej wysłane wiadomości będą widoczne dla
              innych użytkowników.
            </li>
            <li>Twoje zdjęcie zostanie usunięte.</li>
            <li>
              Po usunięciu tego konta możliwe będzie założenie nowego z tym samym adresem e-mail
            </li>
          </ul>
        </DialogContentText>
      ),
      confirmButtonText: "Usuń konto",
      ConfirmButtonProps: {
        color: 'error',
        variant: 'text'
      },
      CancelButtonProps: {
        variant: 'contained'
      },
      onAccept: () =>
        removeAccount(undefined, {
          onSuccess: () => {
            // reload page
            window.location.href = AppRoutes.Home();
          },
        }),
    });
  };

  return (
    <>
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

        <ListItemButton
          sx={(theme) => ({ color: theme.palette.error.main })}
          onClick={handleRemoveAccount}
        >
          <ListItemIcon>
            <Icon name='person_remove' color='error' />
          </ListItemIcon>
          <ListItemText primary='Usuń konto' />
        </ListItemButton>
      </List>
    </>
  );
};
