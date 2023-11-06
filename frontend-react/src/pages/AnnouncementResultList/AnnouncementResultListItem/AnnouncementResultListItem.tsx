import { Divider } from '@mui/material';
import { useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import avatarPlaceholder from 'src/images/avatar-placeholder.png';
import { UserAnnouncement } from 'src/models/annoucement/user-announcement';
import { Avatar, Box, Button, Card, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { calculateAge } from 'src/utils/user-utils';

export type AnnouncementResultListItemProps = {
  data: UserAnnouncement;
  imgSrc: string | null;
};

export const AnnouncementResultListItem = ({ data, imgSrc }: AnnouncementResultListItemProps) => {
  const location = useLocation();
  const age = useMemo(() => calculateAge(data.userBirthDate), [data]);

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
        <Button
          size='small'
          variant='text'
          component={Link}
          to={AppRoutes.PrivateChat({
            userId: data.userId,
            returnUrl: location.pathname + location.search,
          })}
        >
          Wyślij wiadomość
        </Button>
      </Box>
    </Card>
  );
};
