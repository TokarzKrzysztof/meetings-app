import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
} from 'src/ui-components';

export type RemindPasswordConfirmationDialogProps = {
  show: boolean;
  onRetry: () => void;
  onClose: () => void;
  resetPasswordInProgress: boolean;
};

export const RemindPasswordConfirmationDialog = ({
  show,
  onRetry,
  onClose,
  resetPasswordInProgress,
}: RemindPasswordConfirmationDialogProps) => {
  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogContentText align='center'>
          W ciągu kilku minut na podany adres email powinieneneś otrzymać link dzięki
          któremu będzie można zresetować hasło
        </DialogContentText>
        <DialogContentText align='center' mt={4}>
          Link nie dotarł?
          <Button onClick={onRetry} disabled={resetPasswordInProgress} variant='text'>
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
