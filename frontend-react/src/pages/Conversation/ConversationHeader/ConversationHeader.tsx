import { Link, useSearchParams } from 'react-router-dom';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { User } from 'src/models/user';
import { AppBar, Avatar, Button, Icon, Stack, Toolbar, Typography } from 'src/ui-components';

export type ConversationHeaderProps = {
  user: User;
};

export const ConversationHeader = ({ user }: ConversationHeaderProps) => {
  const [searchParams] = useSearchParams();

  return (
    <AppBar position='sticky'>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Button
          variant='text'
          startIcon={<Icon name='arrow_back' />}
          size='small'
          component={Link}
          to={searchParams.get('returnUrl')!}
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
