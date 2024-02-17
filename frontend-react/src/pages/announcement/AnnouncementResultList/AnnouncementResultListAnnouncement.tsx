import { Divider } from '@mui/material';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ExperienceLevel } from 'src/components/ExperienceLevel';
import { LocationText } from 'src/components/LocationText';
import { AnnouncementResultListItem } from 'src/models/annoucement/announcement-result-list';
import { AnnouncementResultListAnnouncementLoginDialog } from 'src/pages/announcement/AnnouncementResultList/AnnouncementResultListAnnouncementLoginDialog';
import { useGetCurrentUser } from 'src/queries/user-queries';
import { Avatar, Box, Button, Card, Stack, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';
import { calculateAge } from 'src/utils/user-utils';

export type AnnouncementResultListAnnouncementProps = {
  data: AnnouncementResultListItem;
};

export const AnnouncementResultListAnnouncement = ({
  data,
}: AnnouncementResultListAnnouncementProps) => {
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const { currentUser } = useGetCurrentUser();

  const age = useMemo(() => calculateAge(data.user.birthDate), [data]);
  const buttonProps = {
    size: 'small',
    variant: 'text',
    children: 'Wyślij wiadomość',
  } as const;
  const privateChatUrl = AppRoutes.PrivateChat({
    userId: data.userId,
    announcementId: data.announcementId,
  });

  // simply check after logging in to hide current user announcements, instead of removing announcements cache
  if (currentUser?.id === data.userId) return null;
  return (
    <>
      <Card>
        <Stack p={1} alignItems='center'>
          <Avatar src={data.user.profileImageSrc} size={50} />
          <Box ml={2}>
            <Typography fontSize={14}>
              {data.user.firstName}, {age}
            </Typography>
            <LocationText locationId={data.user.locationId} />
          </Box>
        </Stack>
        <Divider />
        <Box p={1}>
          <ExperienceLevel level={data.announcementExperienceLevel} />
          <Typography fontSize={13} whiteSpace='pre-wrap'>
            {data.description}
          </Typography>
        </Box>
        <Divider />
        <Box textAlign='right'>
          {currentUser ? (
            <Button component={Link} to={privateChatUrl} {...buttonProps} />
          ) : (
            <Button onClick={() => setShowLoginPrompt(true)} {...buttonProps} />
          )}
        </Box>
      </Card>
      {showLoginPrompt && (
        <AnnouncementResultListAnnouncementLoginDialog
          loginRedirectUrl={privateChatUrl}
          onClose={() => setShowLoginPrompt(false)}
        />
      )}
    </>
  );
};
