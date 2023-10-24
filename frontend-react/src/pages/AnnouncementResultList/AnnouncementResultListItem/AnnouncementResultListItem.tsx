import { Divider } from '@mui/material';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Avatar, Box, Button, Card, Stack, Typography } from 'src/ui-components';

export type AnnouncementResultListItemProps = {};

export const AnnouncementResultListItem = ({ ...props }: AnnouncementResultListItemProps) => {
  const { currentUser } = useGetCurrentUser();

  return (
    <Card>
      <Stack p={1} alignItems={'center'}>
        <Avatar
          src={currentUser?.profileImage ?? avatarPlaceholder}
          sx={{ width: 50, height: 50 }}
        />
        <Box ml={2}>
          <Typography fontSize={14}>Krzysiek, 27</Typography>
          <Typography fontSize={14} color='grey'>
            Limanowa <span style={{ whiteSpace: 'nowrap' }}>(30km od Ciebie)</span>
          </Typography>
        </Box>
      </Stack>
      <Divider></Divider>
      <Typography fontSize={13} p={1}>
        Witam! Zagram w tenisa! <br />
        Witam! Zagram w tenisa! <br />
        Witam! Zagram w tenisa! <br />
        Witam! Zagram w tenisa! <br />
      </Typography>
      <Divider></Divider>
      <Box textAlign='right'>
        <Button size='small' variant='text'>
          Wyślij wiadomość
        </Button>
      </Box>
    </Card>
  );
};
