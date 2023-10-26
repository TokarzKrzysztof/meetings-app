import { Divider } from '@mui/material';
import { useMemo } from 'react';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { UserAnnouncement } from 'src/models/annoucement/user-announcement';
import { Avatar, Box, Button, Card, Stack, Typography } from 'src/ui-components';

export type AnnouncementResultListItemProps = {
  data: UserAnnouncement;
  imgSrc: string | null;
};

export const AnnouncementResultListItem = ({ data, imgSrc }: AnnouncementResultListItemProps) => {
  const age = useMemo(() => {
    const today = new Date();
    const birthDate = new Date(data.userBirthDate);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }, [data]);

  return (
    <Card>
      <Stack p={1} alignItems={'center'}>
        <Avatar src={imgSrc ?? avatarPlaceholder} sx={{ width: 50, height: 50 }} />
        <Box ml={2}>
          <Typography fontSize={14}>
            {data.userFirstName}, {age}
          </Typography>
          <Typography fontSize={14} color='grey'>
            Limanowa <span style={{ whiteSpace: 'nowrap' }}>(30km od Ciebie)</span>
          </Typography>
        </Box>
      </Stack>
      <Divider />
      <Typography fontSize={13} p={1} whiteSpace={'pre-wrap'}>
        {data.description}
      </Typography>
      <Divider />
      <Box textAlign='right'>
        <Button size='small' variant='text'>
          Wyślij wiadomość
        </Button>
      </Box>
    </Card>
  );
};
