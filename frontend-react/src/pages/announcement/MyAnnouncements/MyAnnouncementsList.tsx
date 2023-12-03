import { Announcement, AnnouncementStatus } from 'src/models/annoucement/announcement';
import { MyAnnouncementsListItem } from 'src/pages/announcement/MyAnnouncements/MyAnnouncementsListItem';
import { Box, Stack, Typography } from 'src/ui-components';

export type MyAnnouncementsListProps = {
  data: Announcement[];
  status: AnnouncementStatus;
  title: string;
  noAnnoucementsText: string;
};

export const MyAnnouncementsList = ({
  data,
  status,
  title,
  noAnnoucementsText,
}: MyAnnouncementsListProps) => {
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
