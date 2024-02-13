import { Link } from 'react-router-dom';
import { Header } from 'src/components/header/Header';
import { useGetCurrentUserAnnouncementsCount } from 'src/queries/announcement-queries';
import {
  Box,
  Button,
  Container,
  Icon,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from 'src/ui-components';
import { AppRoutes } from 'src/utils/enums/app-routes';

export const MyAnnouncements = () => {
  const { currentUserAnnouncementsCount, currentUserAnnouncementsCountFetching } =
    useGetCurrentUserAnnouncementsCount();

  if (currentUserAnnouncementsCountFetching) return null;
  return (
    <>
      <Header />
      <Container sx={{ py: 2 }} maxWidth='sm'>
        <Typography variant='h6' mb={2} textAlign='center' fontWeight='bold' position='relative'>
          Moje ogłoszenia
        </Typography>

        <List sx={{ mt: 1 }} color='primary'>
          <ListItemButton
            component={Link}
            to={AppRoutes.MyAnnouncementsList({ status: 'Active' })}
            sx={{ pr: 0 }}
          >
            <ListItemText primary={`Aktywne (${currentUserAnnouncementsCount!.active})`} />
            <ListItemIcon sx={{ minWidth: 'initial' }}>
              <Icon name='navigate_next' />
            </ListItemIcon>
          </ListItemButton>

          <ListItemButton
            component={Link}
            to={AppRoutes.MyAnnouncementsList({ status: 'Pending' })}
            sx={{ pr: 0 }}
          >
            <ListItemText primary={`Oczekujące (${currentUserAnnouncementsCount!.pending})`} />
            <ListItemIcon sx={{ minWidth: 'initial' }}>
              <Icon name='navigate_next' />
            </ListItemIcon>
          </ListItemButton>

          <ListItemButton
            component={Link}
            to={AppRoutes.MyAnnouncementsList({ status: 'Closed' })}
            sx={{ pr: 0 }}
          >
            <ListItemText primary={`Zakończone (${currentUserAnnouncementsCount!.closed})`} />
            <ListItemIcon sx={{ minWidth: 'initial' }}>
              <Icon name='navigate_next' />
            </ListItemIcon>
          </ListItemButton>
        </List>
        <Box textAlign='center' my={3}>
          <Button
            variant='outlined'
            sx={{ width: '100%' }}
            component={Link}
            to={AppRoutes.NewAnnouncement()}
          >
            Dodaj nowe ogłoszenie
          </Button>
        </Box>
      </Container>
    </>
  );
};

MyAnnouncements.displayName = 'MyAnnouncements';
