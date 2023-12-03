import { useSetAtom } from 'jotai';
import { useRef } from 'react';
import { showNewPrivateMessageAtom } from 'src/pages/chat/MyChats/MyChatsNewPrivateMessage';
import { Icon, IconButton, Menu, MenuItem } from 'src/ui-components';

export type MyChatsTabsCreateNewProps = {};

export const MyChatsTabsCreateNew = ({ ...props }: MyChatsTabsCreateNewProps) => {
  const menuAnchorRef = useRef<HTMLButtonElement>(null);
  const setShowNewPrivateMessage = useSetAtom(showNewPrivateMessageAtom);

  return (
    <>
      <IconButton color='primary' size='small' ref={menuAnchorRef}>
        <Icon name='add' />
      </IconButton>
      <Menu anchorRef={menuAnchorRef}>
        <MenuItem>Utwórz rozmowę grupową</MenuItem>
        <MenuItem onClick={() => setShowNewPrivateMessage(true)}>
          Wyślij prywatną wiadomość
        </MenuItem>
      </Menu>
    </>
  );
};
