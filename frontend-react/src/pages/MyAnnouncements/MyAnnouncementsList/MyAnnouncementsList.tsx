import { useMemo } from 'react';
import { Announcement, AnnouncementStatus } from 'src/models/annoucement/announcement';
import { MyAnnouncementsListItem } from 'src/pages/MyAnnouncements/MyAnnouncementsListItem/MyAnnouncementsListItem';
import { Box, Stack, Typography } from 'src/ui-components';

export type MyAnnouncementsListProps = {
  data: Announcement[];
  status: AnnouncementStatus;
};

export const MyAnnouncementsList = ({ data, status }: MyAnnouncementsListProps) => {
  const title = useMemo(() => {
    if (status === AnnouncementStatus.Active) return 'Aktywne';
    if (status === AnnouncementStatus.Pending) return 'Oczekujące';
    return 'Zakończone';
  }, [status]);

  const noAnnoucementsText = useMemo(() => {
    if (status === AnnouncementStatus.Active) return 'Brak aktywnych ogłoszeń';
    if (status === AnnouncementStatus.Pending) return 'Brak oczekujących ogłoszeń';
    return 'Brak zakończonych ogłoszeń';
  }, [status]);

  return (
    <Box my={3}>
      <Typography variant='h6' textAlign='center' mb={1}>
        {title}
      </Typography>
      {data.length ? (
        <Stack direction='column' gap={2}>
          {data.map((x) => (
            <MyAnnouncementsListItem key={x.id} announcement={x}></MyAnnouncementsListItem>
          ))}
        </Stack>
      ) : (
        <Typography textAlign='center' color='grey'>
          {noAnnoucementsText}
        </Typography>
      )}
    </Box>
  );
};
