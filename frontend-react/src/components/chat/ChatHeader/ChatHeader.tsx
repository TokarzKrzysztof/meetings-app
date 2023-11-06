import { Link } from 'react-router-dom';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
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
          <Avatar src={user.profileImage ?? avatarPlaceholder} sx={{ width: 30, height: 30 }} />
          <Typography>
            {user.firstName} {user.lastName}
          </Typography>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};
