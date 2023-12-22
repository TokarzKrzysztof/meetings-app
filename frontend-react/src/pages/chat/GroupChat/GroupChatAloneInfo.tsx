import { Button, Dialog, DialogContent, DialogContentText } from 'src/ui-components';

export type GroupChatAloneInfoProps = {
  onClose: () => void;
  onOpenParticipantsDialog: () => void;
};

export const GroupChatAloneInfo = ({
  onClose,
  onOpenParticipantsDialog,
}: GroupChatAloneInfoProps) => {
  return (
    <Dialog open onClose={onClose}>
      <DialogContent>
        <DialogContentText align='center'>
          Jesteś aktualnie jedynym uczestnikiem tej rozmowy. Kliknij przycisk poniżej aby dodać
          innych użytkowników
        </DialogContentText>
        <DialogContentText align='center' mt={4}>
          <Button onClick={onOpenParticipantsDialog} size='large'>
            Dodaj
          </Button>
        </DialogContentText>
      </DialogContent>
    </Dialog>
  );
};
