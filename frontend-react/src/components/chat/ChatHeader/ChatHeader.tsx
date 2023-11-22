import { Link } from 'react-router-dom';
import { UserActiveStatusBadge } from 'src/components/UserActiveStatusBadge/UserActiveStatusBadge';
import { User } from 'src/models/user';
import { AppBar, Avatar, Button, Icon, Stack, Toolbar, Typography } from 'src/ui-components';

export type ChatHeaderProps = {
  user: User;
  returnUrl: string;
};

export const ChatHeader = ({ user, returnUrl }: ChatHeaderProps) => {
  return (
    <AppBar position='static'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button
          variant='text'
          startIcon={<Icon name='arrow_back' />}
          size='small'
          component={Link}
          to={returnUrl}
          color='inherit'
        >
          Wróć
        </Button>
        <Stack alignItems={'center'} gap={1}>
          <UserActiveStatusBadge status={user.activeStatus}>
            <Avatar src={user.profileImage} size={30} />
          </UserActiveStatusBadge>
          <Typography>
            {user.firstName} {user.lastName}
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
