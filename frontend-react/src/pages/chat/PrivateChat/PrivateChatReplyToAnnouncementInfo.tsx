import { useState } from 'react';
import { Announcement } from 'src/models/annoucement/announcement';
import { Box, Icon, IconButton, Stack, Typography } from 'src/ui-components';
import { limitLinesVertical } from 'src/utils/style-utils';

export type PrivateChatReplyToAnnouncementInfoProps = {
  description: Announcement['description'];
};

export const PrivateChatReplyToAnnouncementInfo = ({
  description,
}: PrivateChatReplyToAnnouncementInfoProps) => {
  const [show, setShow] = useState(true);

  if (!show) return null;
  return (
    <Box p={1} sx={(theme) => ({ background: theme.palette.grey[100] })}>
      <Stack justifyContent={'space-between'} alignItems={'center'}>
        <Typography fontWeight={'bold'} fontSize={14}>Odpowiadasz na ogłoszenie:</Typography>
        <IconButton onClick={() => setShow(false)} size='small'>
          <Icon name='close'></Icon>
        </IconButton>
      </Stack>
      <Typography fontSize={13} sx={limitLinesVertical(15)}>
        {description}
      </Typography>
    </Box>
  );
};
