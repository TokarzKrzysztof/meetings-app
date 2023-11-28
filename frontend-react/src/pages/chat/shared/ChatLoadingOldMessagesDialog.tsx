import { Box, CircularProgress, Dialog, DialogContent, DialogContentText } from 'src/ui-components';

export type ChatLoadingOldMessagesDialogProps = {
  onClose: () => void;
};

export const ChatLoadingOldMessagesDialog = ({ onClose }: ChatLoadingOldMessagesDialogProps) => {
  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <DialogContentText textAlign={'center'}>
          Trwa ładowanie wcześniejszych wiadomości
        </DialogContentText>
        <Box display={'flex'} justifyContent={'center'} mt={2}>
          <CircularProgress size={20} />
        </Box>
      </DialogContent>
    </Dialog>
  );
};
