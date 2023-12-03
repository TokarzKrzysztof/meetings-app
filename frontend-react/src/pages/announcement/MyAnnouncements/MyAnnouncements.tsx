import { Divider } from '@mui/material';
import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { AnnouncementStatus } from 'src/models/annoucement/announcement';
import { MyAnnouncementsList } from 'src/pages/announcement/MyAnnouncements/MyAnnouncementsList';
import { useGetCurrentUserAnnouncements } from 'src/queries/announcement-queries';
import { useGetAllCategories } from 'src/queries/category-queries';
import { Container, Icon, IconButton, Typography } from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

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
      <Container sx={{ py: 2 }} maxWidth='sm'>
        <Typography variant='h5' mb={2} textAlign='center' fontWeight='bold' position={'relative'}>
          Moje ogłoszenia
          <IconButton
            color='primary'
            sx={{ position: 'absolute', right: 0, top: -1 }}
            component={Link}
            to={AppRoutes.NewAnnouncement()}
            size='small'
          >
            <Icon name='add' />
          </IconButton>
        </Typography>
        <Divider></Divider>
        <MyAnnouncementsList
          data={data.activeAnnouncements}
          status={AnnouncementStatus.Active}
          title='Aktywne'
          noAnnoucementsText='Brak aktywnych ogłoszeń'
        />
        <MyAnnouncementsList
          data={data.pendingAnnouncements}
          status={AnnouncementStatus.Pending}
          title='Oczekujące'
          noAnnoucementsText='Brak oczekujących ogłoszeń'
        />
        <MyAnnouncementsList
          data={data.closedAnnouncements}
          status={AnnouncementStatus.Closed}
          title='Zakończone'
          noAnnoucementsText='Brak zakończonych ogłoszeń'
        />
      </Container>
    </>
  );
};

MyAnnouncements.displayName = 'MyAnnouncements';
