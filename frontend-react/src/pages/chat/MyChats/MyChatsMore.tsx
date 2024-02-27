import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { showNewPrivateMessageAtom } from 'src/pages/chat/MyChats/MyChatsNewPrivateMessage';
import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const ignoredChatsTxt = 'Ignorowane rozmowy';
export const archivedChatsTxt = 'Archiwum rozmów';

export type MyChatsMoreProps = {};

export const MyChatsMore = ({ ...props }: MyChatsMoreProps) => {
  const menuAnchorRef = useRef<HTMLButtonElement>(null);
  const setShowNewPrivateMessage = useSetAtom(showNewPrivateMessageAtom);

  return (
    <>
      <IconButton color='primary' size='small' ref={menuAnchorRef}>
        <Icon name='more_horiz' />
      </IconButton>
      <Menu anchorRef={menuAnchorRef}>
        <MenuItem component={Link} to={AppRoutes.NewGroupChat()}>
          <ListItemIcon>
            <Icon name={'group_add'} />
          </ListItemIcon>
          <ListItemText>Utwórz rozmowę grupową</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setShowNewPrivateMessage(true)}>
          <ListItemIcon>
            <Icon name={'send'} />
          </ListItemIcon>
          <ListItemText>Wyślij prywatną wiadomość</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to={AppRoutes.MyChatsIgnored()}>
          <ListItemIcon>
            <Icon name={'person_off'} />
          </ListItemIcon>
          <ListItemText>{ignoredChatsTxt}</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to={AppRoutes.MyChatsArchived()}>
          <ListItemIcon>
            <Icon name={'archive'} />
          </ListItemIcon>
          <ListItemText>{archivedChatsTxt}</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};
