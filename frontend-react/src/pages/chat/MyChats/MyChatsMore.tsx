import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { Icon, IconButton, Menu, MenuItem } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const ignoredChatsTxt = 'Ignorowane rozmowy';
export const archivedChatsTxt = 'Archiwum rozmów';

export type MyChatsMoreProps = {};

export const MyChatsMore = ({ ...props }: MyChatsMoreProps) => {
  const menuAnchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton color='primary' size='small' ref={menuAnchorRef}>
        <Icon name='more_vert' />
      </IconButton>
      <Menu anchorRef={menuAnchorRef}>
        <MenuItem component={Link} to={AppRoutes.MyChatsIgnored()}>
          {ignoredChatsTxt}
        </MenuItem>
        <MenuItem component={Link} to={AppRoutes.MyChatsArchived()}>
          {archivedChatsTxt}
        </MenuItem>
      </Menu>
    </>
  );
};
