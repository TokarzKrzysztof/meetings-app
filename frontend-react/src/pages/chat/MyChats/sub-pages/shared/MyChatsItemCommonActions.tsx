import { useSetAtom } from 'jotai';
import { useSnackbar } from 'notistack';
import { ChatPreview } from 'src/models/chat/chat-preview';
import { archivedChatsTxt, ignoredChatsTxt } from 'src/pages/chat/MyChats/MyChatsMore';
import { confirmationDialogAtom } from 'src/providers/ConfirmationDialogProvider/ConfirmationDialogProvider';
import { useToggleArchiveChat, useToggleIgnoreChat } from 'src/queries/chat-queries';
import { MenuItem, Typography } from 'src/ui-components';

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
          <Typography>Czy na pewno chcesz ignorować tą rozmowę?</Typography>
          <Typography my={1}>
            Nie będziesz otrzymywać powiadomień o nowych wiadomościach, oraz zostanie ona
            przeniesiona do sekcji &quot;{ignoredChatsTxt}&quot;.
          </Typography>
          <Typography>Tą akcję będzie można w każdym momencie anulować.</Typography>
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
          <Typography>Czy na pewno chcesz zarchiwizować tą rozmowę?</Typography>
          <Typography my={1}>
            Zostanie ona przeniesiona do sekcji &quot;{archivedChatsTxt}&quot;.
          </Typography>
          <Typography>
            Po otrzymaniu nowej wiadomości zostanie ona przywrócona, jeżeli natomiast nie chcesz
            otrzymywać powiadomień o nowych wiadomościach użyj opcji ignorowania rozmowy.
          </Typography>
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
