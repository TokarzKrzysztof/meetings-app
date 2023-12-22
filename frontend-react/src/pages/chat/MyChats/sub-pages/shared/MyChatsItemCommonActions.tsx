import { useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { archivedChatsTxt, ignoredChatsTxt } from 'src/pages/chat/MyChats/MyChatsMore';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useToggleArchiveChat, useToggleIgnoreChat } from 'src/queries/chat-queries';
import { DialogContentText, MenuItem } from 'src/ui-components';

export type MyChatsItemCommonActionsProps = {
  chat: ChatPreview;
  onReload: () => void;
};

export const MyChatsItemCommonActions = ({ chat, onReload }: MyChatsItemCommonActionsProps) => {
  const confirm = useSetAtom(confirmationDialogAtom);
  const { toggleIgnoreChat } = useToggleIgnoreChat();
  const { toggleArchiveChat } = useToggleArchiveChat();
  const { enqueueSnackbar } = useSnackbar();

  const handleIgnore = () => {
    confirm({
      message: (
        <>
          <DialogContentText>Czy na pewno chcesz ignorować tą rozmowę?</DialogContentText>
          <DialogContentText my={1}>
            Nie będziesz otrzymywać powiadomień o nowych wiadomościach, oraz zostanie ona
            przeniesiona do sekcji "{ignoredChatsTxt}".
          </DialogContentText>
          <DialogContentText>Tą akcję będzie można w każdym momencie anulować.</DialogContentText>
        </>
      ),
      onAccept: () => {
        toggleIgnoreChat(chat.id, {
          onSuccess: () => {
            enqueueSnackbar({
              variant: 'default',
              message: 'Rozmowa została przeniesiona do ignorowanych',
            });
            onReload();
          },
        });
      },
    });
  };

  const handleArchive = () => {
    confirm({
      message: (
        <>
          <DialogContentText>Czy na pewno chcesz zarchiwizować tą rozmowę?</DialogContentText>
          <DialogContentText my={1}>
            Zostanie ona przeniesiona do sekcji "{archivedChatsTxt}".
          </DialogContentText>
          <DialogContentText>
            Po otrzymaniu nowej wiadomości zostanie ona przywrócona, jeżeli natomiast nie chcesz
            otrzymywać powiadomień o nowych wiadomościach użyj opcji ignorowania rozmowy.
          </DialogContentText>
        </>
      ),
      onAccept: () => {
        toggleArchiveChat(chat.id, {
          onSuccess: () => {
            enqueueSnackbar({
              variant: 'default',
              message: 'Rozmowa została przeniesiona do archiwum',
            });
            onReload();
          },
        });
      },
    });
  };

  return (
    <>
      <MenuItem onClick={handleIgnore}>Ignoruj</MenuItem>
      <MenuItem onClick={handleArchive}>Archiwizuj</MenuItem>
    </>
  );
};
