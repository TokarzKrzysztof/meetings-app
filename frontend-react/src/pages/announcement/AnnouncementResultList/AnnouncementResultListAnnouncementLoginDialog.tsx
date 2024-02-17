import { Link } from 'react-router-dom';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type AnnouncementResultListAnnouncementLoginDialogProps = {
  loginRedirectUrl: string;
  onClose: () => void;
};

export const AnnouncementResultListAnnouncementLoginDialog = ({
  loginRedirectUrl,
  onClose,
}: AnnouncementResultListAnnouncementLoginDialogProps) => {
  return (
    <Dialog open onClose={onClose} sx={{ textAlign: 'center' }}>
      <DialogTitle>Informacja</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Musisz być zalogowany/a żeby wysyłać wiadomości do innych użytkowników
        </DialogContentText>
        <Box pt={3} pb={1}>
          <Button
            size='small'
            component={Link}
            to={AppRoutes.Login({ redirectUrl: loginRedirectUrl })}
          >
            Przejdź do logowania
          </Button>
          <DialogContentText my={1}>Lub</DialogContentText>
          <Button
            size='small'
            component={Link}
            to={AppRoutes.Register({ redirectUrl: loginRedirectUrl })}
          >
            Załóż nowe konto
          </Button>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='text'>
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};
