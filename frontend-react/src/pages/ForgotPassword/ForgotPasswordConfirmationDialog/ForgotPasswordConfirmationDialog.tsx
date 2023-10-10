import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
} from 'src/ui-components';

export type ForgotPasswordConfirmationDialogProps = {
  show: boolean;
  onRetry: () => void;
  onClose: () => void;
  inProgress: boolean;
};

export const ForgotPasswordConfirmationDialog = ({
  show,
  onRetry,
  onClose,
  inProgress,
}: ForgotPasswordConfirmationDialogProps) => {
  return (
    <Dialog open={show}>
      <DialogContent>
        <DialogContentText align='center'>
          W ciągu kilku minut na podany adres email otrzymasz link dzięki
          któremu będzie można zresetować hasło
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
