import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { UserProfile } from 'src/models/user-profile';
import { UserProfileActionsMoreChatSelector } from 'src/pages/user/UserProfile/UserProfileActionsMoreChatSelector';
import { Icon, IconButton, ListItemIcon, ListItemText, Menu, MenuItem } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export type UserProfileActionsMoreProps = {
  userProfile: UserProfile;
};

export const UserProfileActionsMore = ({ userProfile }: UserProfileActionsMoreProps) => {
  const [showChatSelector, setShowChatSelector] = useState(false);
  const menuAnchorRef = useRef<HTMLButtonElement>(null);

  return (
    <>
      <IconButton ref={menuAnchorRef}>
        <Icon name='more_vert' />
      </IconButton>
      <Menu anchorRef={menuAnchorRef}>
        <MenuItem component={Link} to={AppRoutes.NewGroupChat()} state={userProfile.user}>
          <ListItemIcon>
            <Icon name={'group_add'} />
          </ListItemIcon>
          <ListItemText>Utwórz rozmowę grupową</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => setShowChatSelector(true)}>
          <ListItemIcon>
            <Icon name={'groups'} />
          </ListItemIcon>
          <ListItemText>Dodaj do istniejącej rozmowy grupowej</ListItemText>
        </MenuItem>
      </Menu>
      <UserProfileActionsMoreChatSelector
        open={showChatSelector}
        userProfile={userProfile}
        onClose={() => setShowChatSelector(false)}
      />
    </>
  );
};
