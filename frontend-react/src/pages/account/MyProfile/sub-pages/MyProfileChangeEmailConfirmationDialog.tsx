import { Button, Dialog, DialogActions, DialogContent, DialogContentText } from 'src/ui-components';

export type MyProfileChangeEmailConfirmationDialogProps = {
  onRetry: () => void;
  onClose: () => void;
  inProgress: boolean;
};

export const MyProfileChangeEmailConfirmationDialog = ({
  onRetry,
  onClose,
  inProgress,
}: MyProfileChangeEmailConfirmationDialogProps) => {
  return (
    <Dialog open>
      <DialogContent>
        <DialogContentText align='center'>
          W ciągu kilku minut otrzymasz wiadomość na Twój nowy adres email z potwierdzeniem
          dokonanej zmiany. Prosimy o sprawdzenie swojej skrzynki odbiorczej i potwierdzenie zmiany,
          w innym przypadku adres email nie zostanie zmieniony.
        </DialogContentText>
        <DialogContentText align='center' mt={4}>
          Link nie dotarł?
          <Button onClick={onRetry} disabled={inProgress} variant='text'>
            Wyślij ponownie
          </Button>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant='text'>
          Zamknij
        </Button>
      </DialogActions>
    </Dialog>
  );
};
