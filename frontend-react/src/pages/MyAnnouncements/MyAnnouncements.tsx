import { Divider } from '@mui/material';
import { useMemo } from 'react';
import { Header } from 'src/components/Header/Header';
import { AnnouncementStatus } from 'src/models/announcement';
import { MyAnnouncementsList } from 'src/pages/MyAnnouncements/MyAnnouncementsList/MyAnnouncementsList';
import { useGetCurrentUserAnnouncements } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Container, Typography } from 'src/ui-components';

export const MyAnnouncements = () => {
  const { currentUserAnnoucements } = useGetCurrentUserAnnouncements();
  const { allCategories } = useGetAllCategories();

  const data = useMemo(() => {
    if (!currentUserAnnoucements) return null;
    return {
      activeAnnouncements: currentUserAnnoucements.filter(
        (x) => x.status === AnnouncementStatus.Active
      ),
      pendingAnnouncements: currentUserAnnoucements.filter(
        (x) => x.status === AnnouncementStatus.Pending
      ),
      closedAnnouncements: currentUserAnnoucements.filter(
        (x) => x.status === AnnouncementStatus.Closed
      ),
    };
  }, [currentUserAnnoucements]);

  if (!allCategories || !data) return null;
  return (
    <>
      <Header />
      <Container sx={{ py: 2 }}>
        <Typography
          variant={'h5'}
          mb={2}
          textAlign={'center'}
          fontWeight={'bold'}
        >
          Moje ogłoszenia
        </Typography>
        <Divider></Divider>
        <MyAnnouncementsList
          data={data.activeAnnouncements}
          status={AnnouncementStatus.Active}
        />
        <MyAnnouncementsList
          data={data.pendingAnnouncements}
          status={AnnouncementStatus.Pending}
        />
        <MyAnnouncementsList
          data={data.closedAnnouncements}
          status={AnnouncementStatus.Closed}
        />
      </Container>
    </>
  );
};

MyAnnouncements.displayName = 'MyAnnouncements';
